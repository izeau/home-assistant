'use strict';

const request = require('supertest');
const sinon = require('sinon');

const server = require('../server');

describe('API', function() {
  this.slow(200);

  it('responds with a 400 when the method does not exist', () => request(server)
    .get('/xxx')
    .expect(400));

  it('logs an error and responds with a 500 when something goes wrong', () => {
    const sandbox = sinon.sandbox.create();

    sandbox.stub(console, 'error');

    // db is not opened and will throw, causing an error
    return request(server).get('/lists/xxx').expect(500).then(() => {
      sinon.assert.calledOnce(console.error);
      sandbox.restore();
    });
  });
});
