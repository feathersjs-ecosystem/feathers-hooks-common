import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { Ajv, ErrorObject as ajvErrorObject, Options as AjvOptions } from 'ajv';
import { isPromise } from '../common';
import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

export type SyncValidatorFn<H extends HookContext = HookContext> = (
  values: any,
  context: H,
) => { [key: string]: string } | null;
export type AsyncValidatorFn<H extends HookContext = HookContext> = (
  values: any,
  context: H,
) => Promise<object | null>;
export type ValidatorFn<H extends HookContext = HookContext> =
  | SyncValidatorFn<H>
  | AsyncValidatorFn<H>;

export type AjvOrNewable = Ajv | (new (options?: AjvOptions) => Ajv);

export interface ValidateSchemaOptions extends AjvOptions {
  /**
   * The hook will throw if the data does not match the JSON-Schema. error.errors will, by default, contain an array
   * of error messages. You may change this with a custom formatting function. Its a reducing function which works
   * similarly to Array.reduce().
   */
  addNewError: (
    currentFormattedMessages: any,
    ajvErrorObject: ajvErrorObject,
    itemsLen: number,
    itemIndex: number,
  ) => any;
}

/**
 * Validate data using a validation function.
 * @see https://hooks-common.feathersjs.com/hooks.html#validate
 */
export function validate<H extends HookContext = HookContext>(validator: ValidatorFn) {
  return (context: H) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'validate');

    if (typeof validator !== 'function') {
      throw new BadRequest('Expected validator function. (validate)');
    }

    const results = validator(getItems(context), context);

    if (isPromise(results)) {
      return results.then((convertedValues: any) => {
        if (convertedValues) {
          // if values have been sanitized
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
