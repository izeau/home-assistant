'use strict';

const db = require('sqlite');
const { join } = require('path');

const server = require('./server');

const dbPath = join(__dirname, 'database.sqlite');
const migrationsPath = join(__dirname, 'migrations');

db.open(join(__dirname, 'database.sqlite'))
  .then(() => db.migrate({ migrationsPath, force: 'last' }))
  .then(() => db.run('pragma foreign_keys = on'))
  .then(() => server.listen(3000));
