'use strict';

module.exports = function transformItem(item) {
  return Object.assign({}, item, { checked: Boolean(item.checked) });
};
