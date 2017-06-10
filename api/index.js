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

db.open(join(__dirname, 'database.sqlite'))
  .then(() => db.migrate({ force: 'last', migrationsPath: join(__dirname, 'migrations') }))
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
      checked: false
    }));
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

function missingPropsCheck(data, props) {
  return new Promise((resolve, reject) => {
    const err = [];

    for (const prop of props) {
      if (!(prop in data)) {
        err.push(`missing property '${prop}' in data`);
      }
    }

    if (err.length) {
      reject(err);
    } else {
      resolve(data);
    }
  });
}
