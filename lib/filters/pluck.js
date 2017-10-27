
const _pluck = require('../common/_pluck');

module.exports = function (...fields) {
  return data => _pluck(data, fields);
};
