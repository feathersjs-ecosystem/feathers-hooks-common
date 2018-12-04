const set = require('lodash/set');

module.exports = function (obj, path, value) {
  return set(obj, path, value);
};
