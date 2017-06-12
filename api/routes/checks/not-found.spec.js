'use strict';

const { expect } = require('chai');

const notFoundCheck = require('./not-found');

describe('notFoundCheck', () => {
  it('throws 404 when no data', () => {
    expect(() => notFoundCheck().to.throw(404));
  });

  it('responds with given input', () => {
    const input = { a: 1 };
    expect(notFoundCheck(input)).to.equal(input);
  });
});
