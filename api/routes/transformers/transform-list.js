'use strict';

const transformItem = require('./transform-item');

module.exports = function transformList([list, items]) {
  return list
    ? Object.assign({}, list, { items: items.map(transformItem) })
    : null;
};
