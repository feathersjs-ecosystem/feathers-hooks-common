import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { AjvOrNewable, ValidateSchemaOptions } from './validate';
import { getItems } from '../utils/get-items';

/**
 * Validate data using JSON-Schema.
 * @see https://hooks-common.feathersjs.com/hooks.html#validateschema
 */
export function validateSchema<H extends HookContext = HookContext>(
  schema: object | string,
  ajvOrAjv: AjvOrNewable,
  // @ts-ignore
  options: ValidateSchemaOptions = { allErrors: true },
) {
  const addNewError = options?.addNewError || addNewErrorDflt;
  // delete options.addNewError;
  // TODO: Any better way to tell if ajvOrAjv is an instance or a constructor?
  let ajv: any;
  let Ajv;
  // @ts-ignore
  if (typeof ajvOrAjv.addKeyword !== 'function') {
    Ajv = ajvOrAjv;
    // @ts-ignore
    ajv = new Ajv(options);
  } else {
    ajv = ajvOrAjv;
  }
  const validate = typeof schema === 'string' ? ajv.getSchema(schema) : ajv.compile(schema); // for fastest execution

  return (context: H) => {
    const items = getItems(context);
    const itemsArray = Array.isArray(items) ? items : [items];
    const itemsLen = itemsArray.length;
    let errorMessages: any = null;
    let invalid = false;

    if (validate.schema.$async) {
      return Promise.all(
        itemsArray.map((item, index) => {
          return validate(item).catch((err: any) => {
            if (!(err instanceof ajv.constructor.ValidationError)) throw err;

            invalid = true;

            addErrors(err.errors, index);
          });
        }),
      ).then(() => {
        if (invalid) {
          throw new BadRequest('Data does not match schema', { errors: errorMessages });
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
      throw new BadRequest('Data does not match schema', { errors: errorMessages });
    }

    function addErrors(errors: any, index: any) {
      errors.forEach((ajvError: any) => {
        errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
      });
    }

    return context;
  };
}

function addNewErrorDflt(errorMessages: any, ajvError: any, itemsLen: any, index: any) {
  const leader = itemsLen === 1 ? '' : `in row ${index + 1} of ${itemsLen}, `;
  let message;

  if (ajvError.dataPath) {
    message = `'${leader}${ajvError.dataPath.substring(1)}' ${ajvError.message}`;
  } else {
    message = `${leader}${ajvError.message}`;
  }

  if (ajvError.params && ajvError.params.additionalProperty) {
    message += `: '${ajvError.params.additionalProperty}'`;
  }

  return (errorMessages || []).concat(message);
}
