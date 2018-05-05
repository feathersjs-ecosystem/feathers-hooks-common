
const getByDot = require('./get-by-dot');

module.exports = function (items /* modified */, fieldNames, transformer) {
  [].concat(items).forEach(item => {
    fieldNames.forEach(fieldName => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
};
