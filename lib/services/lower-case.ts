// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

const _transformItems = require('../common/_transform-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContextIf = require('./check-context-if');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (...fieldNames: any[]) {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'lowercase');

    _transformItems(getItems(context), fieldNames, (item: any, fieldName: any, value: any) => {
      if (value !== undefined) {
        if (typeof value !== 'string' && value !== null) {
          throw new errors.BadRequest(`Expected string data. (lowercase ${fieldName})`);
        }

        setByDot(item, fieldName, value ? value.toLowerCase() : value);
      }
    });

    return context;
  };
};
