
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (validator: any) {
  return (context: any) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'validate');

    if (typeof validator !== 'function') {
      throw new errors.BadRequest('Expected validator function. (validate)');
    }

    const results = validator(getItems(context), context);

    if (results && typeof results.then === 'function') {
      return results.then((convertedValues: any) => {
        if (convertedValues) { // if values have been sanitized
          replaceItems(context, convertedValues);
        }

        return context;
      });
    }

    // Sync function returns errors. It cannot sanitize.
    if (results && Object.keys(results).length) {
      throw new errors.BadRequest({ errors: results });
    }

    return context;
  };
};
