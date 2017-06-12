'use strict';

const db = require('sqlite');

exports.getAllLists = () => Promise.resolve()
  .then(() => db.all(`
    select
      l.id,
      l.name,
      u.name as user
    from lists l
    left join users u
      on u.id = l.userId
  `));

exports.getList = listId => Promise.all([
  db.get(`
    select
      l.name,
      u.name as user
    from lists l
    left join users u
      on u.id = l.userId
    where l.id = $listId
  `, {
    $listId: listId,
  }),
  db.all(`
    select
      id,
      name,
      checked
    from items
    where listId = $listId
  `, {
    $listId: listId,
  }),
]);
