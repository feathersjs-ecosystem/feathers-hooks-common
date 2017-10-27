
const getByDot = require('./get-by-dot');

module.exports = function (items /* modified */, fieldNames, transformer) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
};
