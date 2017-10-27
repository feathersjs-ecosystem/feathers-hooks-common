
const _setFields = require('../common/_set-fields');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  return hook => {
    _setFields(getItems(hook), () => new Date(), fieldNames, 'updatedAt');
    return hook;
  };
};
