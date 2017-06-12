'use strict';

const notFoundCheck = require('./checks/not-found');
const { getAllLists, getList } = require('../queries/lists');

const transformList = require('./transformers/transform-list');

module.exports = server => {
  server.get('/lists', (req, res, next) => {
    getAllLists()
      .then(lists => res.json(lists))
      .catch(next);
  });

  server.get('/lists/:listId', (req, res, next) => {
    getList(req.params.listId)
      .then(transformList)
      .then(notFoundCheck)
      .then(list => res.json(list))
      .catch(next);
  });
};
