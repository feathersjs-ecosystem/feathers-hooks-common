
const errors = require('@feathersjs/errors');
const _setFields = require('../common/_set-fields');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  if (!fieldNames.length) {
    throw new errors.BadRequest('Field name is required. (setNow)');
  }

  return context => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'setNow');
    return context;
  };
};
