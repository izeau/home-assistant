'use strict';

const { expect } = require('chai');

const transformList = require('./transform-list');

describe('transformList', () => {
  it('returns null when no list', () => {
    expect(transformList([])).to.be.null;
  });

  it('returns empty items when no items', () => {
    expect(transformList([{}, []])).to.deep.contain({
      items: []
    });
  });

  it('returns transformed items if any', () => {
    const items = [{ checked: 1 }, { checked: 0 }];

    expect(transformList([{}, items])).to.deep.contain({
      items: [{ checked: true }, { checked: false }],
    });
  });
});
