'use strict';

const request = require('supertest');
const db = require('sqlite');
const { expect } = require('chai');
const { join } = require('path');

const server = require('../server');

const migrationsPath = join(__dirname, '../migrations');

describe('Lists', function() {
  this.slow(200);

  beforeEach(() => Promise.resolve()
    .then(() => db.open(':memory:'))
    .then(() => db.migrate({ migrationsPath, force: 'last' }))
    .then(() => db.run('pragma foreign_keys = on'))
  );

  afterEach(() => db.close());

  describe('GET /lists', () => {
    it('responds with a list of lists', () => request(server)
      .get('/lists')
      .set('accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('array');
      }));
  });

  describe('GET /lists/:listId', () => {
    it('responds with a list', () => request(server)
      .get('/lists/1')
      .set('accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body).to.have.all.keys('name', 'user', 'items');
      }));

    it('responds with a 404 if there is no list', () => request(server)
      .get('/lists/xxx')
      .set('accept', 'application/json')
      .expect(404));
  });
});
