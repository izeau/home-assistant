'use strict';

const request = require('supertest');

const server = require('../server');

describe('API', () => {
  it('responds with a 400 when the method does not exist', () => request(server)
    .get('/xxx')
    .expect(400));
});
