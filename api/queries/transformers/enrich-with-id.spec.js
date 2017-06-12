'use strict';

const enrichWithId = require('./enrich-with-id');
const { expect } = require('chai');

describe('enrichWithId', () => {
  it('adds an id from the SQLite response', () => {
    expect(enrichWithId()({ stmt: { lastID: 42 } })).to.contain({ id: 42 });
  });
});
