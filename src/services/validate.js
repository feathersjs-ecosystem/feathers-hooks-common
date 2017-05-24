
import feathersErrors from 'feathers-errors';

import checkContext from './check-context';
import getItems from './get-items';
import replaceItems from './replace-items';

const errors = feathersErrors.errors;

export default function (validator) {
  return context => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'validate');

    if (typeof validator !== 'function') {
      throw new errors.BadRequest(`Expected validator function. (validate)`);
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
}
