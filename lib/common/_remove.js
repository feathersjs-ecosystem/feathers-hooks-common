
const deleteByDot = require('./delete-by-dot');
const _transformItems = require('./_transform-items');

module.exports = function (items /* modified */, fieldNames) {
  _transformItems(items, fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      // Delete fields like item['contactPerson.name']. This is a typical patch format for MongoDB.
      if (item[fieldName]) delete item[fieldName];
      // Delete fields like item.contactPerson.name
      deleteByDot(item, fieldName);
    }
  });
};
