
const deleteByDot = require('./delete-by-dot');
const _transformItems = require('./_transform-items');

module.exports = function (items /* modified */, fieldNames) {
  _transformItems(items, fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      deleteByDot(item, fieldName);
    }
  });
};
