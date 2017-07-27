
import feathersErrors from 'feathers-errors';

import getItems from './get-items';

const errors = feathersErrors.errors;

export default function (schema, ajvOrAjv, options = { allErrors: true }) {
  const addNewError = options.addNewError || addNewErrorDflt;
  // delete options.addNewError;
  // TODO: Any better way to tell if ajvOrAjv is an instance or a constructor?
  let ajv, Ajv;
  if (typeof ajvOrAjv.addKeyword !== 'function') {
    Ajv = ajvOrAjv;
    ajv = new Ajv(options);
  } else {
    ajv = ajvOrAjv;
  }
  const validate = ajv.compile(schema); // for fastest execution

  return hook => {
    const items = getItems(hook);
    const itemsArray = Array.isArray(items) ? items : [items];
    const itemsLen = itemsArray.length;
    let errorMessages = null;
    let invalid = false;

    if (schema.$async) {
      return Promise.all(itemsArray.map((item, index) => {
        return validate(item)
          .catch(err => {
            if (!(err instanceof ajv.constructor.ValidationError)) throw err;

            invalid = true;

            addErrors(err.errors, index);
          });
      })).then(() => {
        if (invalid) {
          throw new errors.BadRequest('Data does not match schema', { errors: errorMessages });
        }
      });
    }

    itemsArray.forEach((item, index) => {
      if (!validate(item)) {
        invalid = true;

        addErrors(validate.errors, index);
      }
    });

    if (invalid) {
      throw new errors.BadRequest('Data does not match schema', { errors: errorMessages });
    }

    function addErrors (errors, index) {
      errors.forEach(ajvError => {
        errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
      });
    }
  };
}

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
