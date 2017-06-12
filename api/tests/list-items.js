'use strict';

const request = require('supertest');
const db = require('sqlite');
const { expect } = require('chai');
const { join } = require('path');

const server = require('../server');

const migrationsPath = join(__dirname, '../migrations');

describe('List items', function() {
  this.slow(200);

  beforeEach(() => Promise.resolve()
    .then(() => db.open(':memory:'))
    .then(() => db.migrate({ migrationsPath, force: 'last' }))
    .then(() => db.run('pragma foreign_keys = on'))
  );

  afterEach(() => db.close());

  describe('POST /lists/:listId/items', () => {
    it('responds with the new item', () => request(server)
      .post('/lists/1/items')
      .set('accept', 'application/json')
      .send({ name: 'Test-created item' })
      .expect(200)
      .expect(res => {
        expect(res.body).to.include.keys('id');
        expect(res.body).to.contain({
          name: 'Test-created item',
          checked: false,
        });
      }));

    it('fails if the name is not provided', () => request(server)
      .post('/lists/1/items', {})
      .expect(400));

    it('fails if the list does not exist', () => request(server)
      .post('/lists/xxx/items')
      .send({ name: 'Does not exist' })
      .expect(400));
  });

  describe('PUT /lists/:listId/items/:itemId', () => {
    it('updates the item', () => request(server)
      .put('/lists/1/items/1')
      .send({ name: 'Test-updated item' })
      .set('accept', 'application/json')
      .expect(204)
      .then(() => db.get('select name from items where id = 1'))
      .then(item => expect(item).to.contain({ name: 'Test-updated item' })));
  });

  describe('DELETE /lists/:listId/items/:itemId', () => {
    it('deletes the item', () => request(server)
      .delete('/lists/1/items/3')
      .set('accept', 'application/json')
      .expect(204)
      .then(() => db.get('select name from items where id = 3'))
      .then(item => expect(item).to.be.undefined));
  });
});
