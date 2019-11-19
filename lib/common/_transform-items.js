
const getByDot = require('lodash/get');

module.exports = function (items /* modified */, fieldNames, transformer) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
};
