
import feathersErrors from 'feathers-errors';
import { getItems, replaceItems, checkContext } from './utils';

const errors = feathersErrors.errors;

export const validate = validator => hook => {
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validate');

  if (typeof validator !== 'function') {
    throw new errors.BadRequest(`Expected validator function. (validate)`);
  }

  const results = validator(getItems(hook));

  if (results && typeof results.then === 'function') {
    return results.then(convertedValues => {
      if (convertedValues) { // if values have been sanitized
        replaceItems(hook, convertedValues);
      }

      return hook;
    });
  }

  // Sync function returns errors. It cannot sanitize.
  if (results && Object.keys(results).length) {
    throw new errors.BadRequest({ errors: results });
  }

  return hook;
};

export const validateSchema = (schema, Ajv, options = { allErrors: true }) => {
  const addNewError = options.addNewError || addNewErrorDflt;
  delete options.addNewError;
  const validate = new Ajv(options).compile(schema); // for fastest execution

  return hook => {
    const items = getItems(hook);
    const itemsArray = Array.isArray(items) ? items : [items];
    const itemsLen = itemsArray.length;
    let errorMessages;
    let invalid = false;

    itemsArray.forEach((item, index) => {
      if (!validate(item)) {
        invalid = true;

        validate.errors.forEach(ajvError => {
          errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
        });
      }
    });

    if (invalid) {
      throw new errors.BadRequest('Invalid schema', { errors: errorMessages });
    }
  };
};

function addNewErrorDflt (errorMessages, ajvError, itemsLen, index) {
  const leader = itemsLen === 1 ? '' : `in row ${index + 1} of ${itemsLen}, `;
  let message;

  if (ajvError.dataPath) {
    message = `'${leader}${ajvError.dataPath.substring(1)}' ${ajvError.message}`;
  } else {
    message = `${leader}${ajvError.message}`;
    if (ajvError.params && ajvError.params.additionalProperty) {
      message += `: '${ajvError.params.additionalProperty}'`;
    }
  }

  return (errorMessages || []).concat(message);
}
