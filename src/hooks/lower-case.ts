import _set from 'lodash/set.js';
import errors from '@feathersjs/errors';
const { BadRequest } = errors;

import { transformItems } from '../common';
import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import type { Hook } from '@feathersjs/feathers';

/**
 * Convert certain field values to lower case.
 * {@link https://hooks-common.feathersjs.com/hooks.html#lowercase}
 */
export function lowerCase (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'lowercase');

    transformItems(getItems(context), fieldNames, (item: any, fieldName: any, value: any) => {
      if (value !== undefined) {
        if (typeof value !== 'string' && value !== null) {
          throw new BadRequest(`Expected string data. (lowercase ${fieldName})`);
        }

        _set(item, fieldName, value ? value.toLowerCase() : value);
      }
    });

    return context;
  };
}
