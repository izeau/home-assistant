'use strict';

module.exports = function enrichWithId(item) {
  return ({ stmt }) => Object.assign({ id: stmt.lastID }, item);
};
