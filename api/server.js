'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const mountListItemsRoutes = require('./routes/list-items');
const mountListsRoutes = require('./routes/lists');

const server = module.exports = express();

// Server configuration

server.enable('case-sensitive routing');
server.enable('strict routing');
server.set('json spaces', 2);
server.disable('x-powered-by');

// Middlewares

server.use(bodyParser.json());

// Routes

mountListItemsRoutes(server);
mountListsRoutes(server);

// Bad request handler

server.use((req, res) => {
  res.sendStatus(400);
});

// Error handler

server.use((err, req, res, next) => {
  if (typeof err === 'number') {
    res.sendStatus(err);

    return;
  }

  if (Array.isArray(err)) {
    res.status(400).json(err);

    return;
  }

  if (err.code === 'SQLITE_CONSTRAINT') {
    res.sendStatus(400);

    return;
  }

  console.error(err);
  res.sendStatus(500);
});
