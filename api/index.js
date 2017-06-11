'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('sqlite');
const { join } = require('path');

const app = express();

// Server configuration

app.enable('case-sensitive routing');
app.enable('strict routing');
app.set('json spaces', 2);
app.disable('x-powered-by');

// Middlewares

app.use(bodyParser.json());

// Routes

app.get('/lists', (req, res, next) => {
  getAllLists()
    .then(lists => res.json(lists))
    .catch(next);
});

app.get('/lists/:listId', (req, res, next) => {
  Promise.all([
    getList(req.params.listId),
    getAllItemsFromList(req.params.listId),
  ]).then(transformList)
    .then(list => res.json(list))
    .catch(next);
});

app.post('/lists/:listId/items', (req, res, next) => {
  createItem(req.params.listId, req.body)
    .then(item => res.json(item))
    .catch(next);
});

app.put('/lists/:listId/items/:itemId', (req, res, next) => {
  updateItem(req.params.listId, req.params.itemId, req.body)
    .then(() => res.sendStatus(204))
    .catch(next);
});

app.delete('/lists/:listId/items/:itemId', (req, res, next) => {
  deleteItem(req.params.listId, req.params.itemId)
    .then(() => res.sendStatus(204))
    .catch(next);
});

// Bad request handler

app.use((req, res) => res.sendStatus(400));

// Error handler

app.use((err, req, res, next) => {
  if (typeof err === 'number') {
    res.sendStatus(err);

    return;
  }

  if (Array.isArray(err)) {
    res.status(400).json(err);

    return;
  }

  console.error(err);
  next();
  res.sendStatus(500);
});

// Database initialization

const dbPath = join(__dirname, 'database.sqlite');
const migrationsPath = join(__dirname, 'migrations');

db.open(join(__dirname, 'database.sqlite'))
  .then(() => db.migrate({ migrationsPath, force: 'last' }))
  .then(() => app.listen(3000));

// Database layer

function getAllLists() {
  return db.all(`
      select
        l.id,
        l.name,
        u.name as user
      from lists l
      left join users u
        on u.id = l.userId
    `);
}

function getList(listId) {
  return db.get(`
    select
      l.name,
      u.name as user
    from lists l
    left join users u
      on u.id = l.userId
    where l.id = $listId
  `, {
    $listId: listId,
  }).then(notFoundCheck);
}

function getAllItemsFromList(listId) {
  return db.all(`
    select
      id,
      name,
      checked
    from items
    where listId = $listId
  `, {
    $listId: listId,
  });
}

function createItem(listId, item) {
  return missingPropsCheck(item, ['name'])
    .then(() => db.run(`
      insert into items (name,  checked, listId)
                 values ($name, 0,       $listId)
    `, {
      $name: item.name,
      $listId: listId,
    }))
    .then(enrichWithId({
      name: item.name,
      checked: false,
    }));
}

function updateItem(listId, itemId, item) {
  return missingPropsCheck(item, null, ['name', 'checked'])
    .then(({ query, parameters }) => db.run(`
      update items set ${query}
      where
        id = $itemId
        and listId = $listId
    `, Object.assign({
      $itemId: itemId,
      $listId: listId,
    }, parameters)));
}

function deleteItem(listId, itemId) {
  return db.run(`
    delete from items
    where
      id = $itemId
      and listId = $listId
    `, {
      $itemId: itemId,
      $listId: listId,
    });
}

// Transformers

function enrichWithId(item) {
  return ({ stmt }) => Object.assign({ id: stmt.lastID }, item);
}

function transformList([list, items]) {
  return Object.assign({}, list, { items: items.map(transformItem) });
}

function transformItem(item) {
  return Object.assign({}, item, { checked: Boolean(item.checked) });
}

// Checks

function notFoundCheck(data) {
  if (!data) {
    throw 404;
  }

  return data;
}

function missingPropsCheck(data, required, optional) {
  return new Promise((resolve, reject) => {
    const err = [];
    const sanitized = {};
    const queryParts = [];
    const parameters = {};
    const requiredParameters = required || [];
    const optionalParameters = optional || [];

    for (const prop of requiredParameters) {
      if (prop in data) {
        const value = data[prop];

        sanitized[prop] = value;
        parameters[`$${prop}`] = value;
        queryParts.push(`${prop} = $${prop}`);
      } else {
        err.push(`missing property '${prop}' in data`);
      }
    }

    for (const prop of optionalParameters) {
      if (prop in data) {
        const value = data[prop];

        sanitized[prop] = value;
        parameters[`$${prop}`] = value;
        queryParts.push(`${prop} = $${prop}`);
      }
    }

    if (err.length) {
      reject(err);
    } else {
      resolve({ sanitized, parameters, query: queryParts.join(', ') });
    }
  });
}
