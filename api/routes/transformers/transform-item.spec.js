'use strict';

const { expect } = require('chai');

const transformItem = require('./transform-item');

describe('transformItem', () => {
  it('casts .checked to a boolean', () => {
    expect(transformItem({ checked: 0 })).to.contain({ checked: false });
    expect(transformItem({ checked: 1 })).to.contain({ checked: true });
  });
});
