
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (validator) {
  return context => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'validate');

    if (typeof validator !== 'function') {
      throw new errors.BadRequest('Expected validator function. (validate)');
    }

    const results = validator(getItems(context), context);

    if (results && typeof results.then === 'function') {
      return results.then(convertedValues => {
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
