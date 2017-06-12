'use strict';

module.exports = function notFound(data) {
  if (!data) {
    throw 404;
  }

  return data;
};
