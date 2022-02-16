// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (schema: any, ajvOrAjv: any, options = { allErrors: true }) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'addNewError' does not exist on type '{ a... Remove this comment to see the full error message
  const addNewError = options.addNewError || addNewErrorDflt;
  // delete options.addNewError;
  // TODO: Any better way to tell if ajvOrAjv is an instance or a constructor?
  let ajv: any, Ajv;
  if (typeof ajvOrAjv.addKeyword !== 'function') {
    Ajv = ajvOrAjv;
    ajv = new Ajv(options);
  } else {
    ajv = ajvOrAjv;
  }
  const validate = (typeof schema === 'string') ? ajv.getSchema(schema) : ajv.compile(schema); // for fastest execution

  return (context: any) => {
    const items = getItems(context);
    const itemsArray = Array.isArray(items) ? items : [items];
    const itemsLen = itemsArray.length;
    let errorMessages: any = null;
    let invalid = false;

    if (validate.schema.$async) {
      return Promise.all(itemsArray.map((item, index) => {
        return validate(item)
          .catch((err: any) => {
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

    function addErrors (errors: any, index: any) {
      errors.forEach((ajvError: any) => {
        errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
      });
    }
  };
};

function addNewErrorDflt (errorMessages: any, ajvError: any, itemsLen: any, index: any) {
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
