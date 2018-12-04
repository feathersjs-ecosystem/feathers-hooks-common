const has = require('lodash/has');

module.exports = function (obj, path) {
  return has(obj, path);
};
