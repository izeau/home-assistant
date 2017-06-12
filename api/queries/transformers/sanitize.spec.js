'use strict';

const sanitize = require('./sanitize');
const { expect } = require('chai');

describe('sanitize', () => {
  it('filters out unwanted props', () => sanitize({ a: 1 })()
    .then(({ sanitized }) => expect(sanitized).to.be.empty));

  it('enforces required props', () => sanitize({}, ['required'])()
    .then(() => expect.fail)
    .catch(err => expect(err).to.be.an('array').of.length(1)));

  it('does not enforce optional props', () => sanitize({}, null, ['optional'])()
    .then(() => expect.ok));

  it('creates parameters', () => sanitize({ a: 1, b: 2, c: 3 }, ['a'], ['b'])()
    .then(({ parameters }) => {
      expect(parameters).to.contain({ $a: 1, $b: 2 });
      expect(parameters).to.not.contain.keys('$c');
    }));

  it('creates a query', () => sanitize({ a: 1, b: 2, c: 3 }, ['a'], ['b'])()
    .then(({ query }) => expect(query).to.equal('a = $a, b = $b')));
});
