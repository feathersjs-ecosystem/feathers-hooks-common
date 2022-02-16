
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
const _setFields = require('../common/_set-fields');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (...fieldNames: any[]) {
  if (!fieldNames.length) {
    throw new errors.BadRequest('Field name is required. (setNow)');
  }

  return (context: any) => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'setNow');
    return context;
  };
};
