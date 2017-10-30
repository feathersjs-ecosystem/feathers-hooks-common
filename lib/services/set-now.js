
const errors = require('feathers-errors');
const _setFields = require('../common/_set-fields');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  if (!fieldNames.length) {
    throw new errors.BadRequest('Field name is required. (setNow)');
  }

  return hook => {
    _setFields(getItems(hook), () => new Date(), fieldNames, 'setNow');
    return hook;
  };
};
