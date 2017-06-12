'use strict';

const db = require('sqlite');

const sanitize = require('./transformers/sanitize');
const enrichWithId = require('./transformers/enrich-with-id');

exports.createItem = (listId, item) => Promise.resolve()
  .then(sanitize(item, ['name']))
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

exports.updateItem = (listId, itemId, item) => Promise.resolve()
  .then(sanitize(item, null, ['name', 'checked']))
  .then(({ query, parameters }) => db.run(`
    update items set ${query}
    where
      id = $itemId
      and listId = $listId
  `, Object.assign({
    $itemId: itemId,
    $listId: listId,
  }, parameters)));

exports.deleteItem = (listId, itemId) => Promise.resolve()
  .then(() => db.run(`
    delete from items
    where
      id = $itemId
      and listId = $listId
  `, {
    $itemId: itemId,
    $listId: listId,
  }));
