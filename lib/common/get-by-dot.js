const get = require('lodash/get');

module.exports = function (obj, path) {
  return get(obj, path);
};
