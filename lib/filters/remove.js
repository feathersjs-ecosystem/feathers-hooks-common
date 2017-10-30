
const _remove = require('../common/_remove');

module.exports = function (...fields) {
  return data => {
    _remove(data, fields);
    return data;
  };
};
