import { BadRequest } from '@feathersjs/errors';
import { Hook } from '@feathersjs/feathers';
import { isPromise } from '../helpers';
import { ValidatorFn } from '../types';
import {checkContext} from './check-context';
import {getItems} from './get-items';
import {replaceItems} from './replace-items';

/**
 * Validate data using a validation function.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Validate}
 */
export function validate (
  validator: ValidatorFn
): Hook {
  return (context: any) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'validate');

    if (typeof validator !== 'function') {
      throw new BadRequest('Expected validator function. (validate)');
    }

    const results = validator(getItems(context), context);

    if (isPromise(results)) {
      return results.then((convertedValues: any) => {
        if (convertedValues) { // if values have been sanitized
          replaceItems(context, convertedValues);
        }

        return context;
      });
    }

    // Sync function returns errors. It cannot sanitize.
    if (results && Object.keys(results).length) {
      // @ts-ignore
      throw new BadRequest({ errors: results });
    }

    return context;
  };
}
