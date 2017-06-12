'use strict';

const {
  createItem,
  updateItem,
  deleteItem,
} = require('../queries/items');

module.exports = server => {
  server.post('/lists/:listId/items', (req, res, next) => {
    createItem(req.params.listId, req.body)
      .then(item => res.json(item))
      .catch(next);
  });

  server.put('/lists/:listId/items/:itemId', (req, res, next) => {
    updateItem(req.params.listId, req.params.itemId, req.body)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  server.delete('/lists/:listId/items/:itemId', (req, res, next) => {
    deleteItem(req.params.listId, req.params.itemId)
      .then(() => res.sendStatus(204))
      .catch(next);
  });
};
