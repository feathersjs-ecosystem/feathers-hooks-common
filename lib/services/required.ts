// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'existsByDo... Remove this comment to see the full error message
const existsByDot = require('lodash/has');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (...fieldNames: any[]) {
  return (context: any) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'required');
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      fieldNames.forEach(name => {
        if (!existsByDot(item, name)) throw new errors.BadRequest(`Field ${name} does not exist. (required)`);
        const value = getByDot(item, name);
        if (!value && value !== 0 && value !== false) throw new errors.BadRequest(`Field ${name} is null. (required)`);
      });
    });
  };
};
