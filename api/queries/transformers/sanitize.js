'use strict';

module.exports = function sanitize(data, required, optional) {
  return () => new Promise((resolve, reject) => {
    const err = [];
    const sanitized = {};
    const queryParts = [];
    const parameters = {};
    const requiredParameters = required || [];
    const optionalParameters = optional || [];

    for (const prop of requiredParameters) {
      if (prop in data) {
        const value = data[prop];

        sanitized[prop] = value;
        parameters[`$${prop}`] = value;
        queryParts.push(`${prop} = $${prop}`);
      } else {
        err.push(`missing property '${prop}' in data`);
      }
    }

    for (const prop of optionalParameters) {
      if (prop in data) {
        const value = data[prop];

        sanitized[prop] = value;
        parameters[`$${prop}`] = value;
        queryParts.push(`${prop} = $${prop}`);
      }
    }

    if (err.length) {
      reject(err);
    } else {
      resolve({ sanitized, parameters, query: queryParts.join(', ') });
    }
  });
};
