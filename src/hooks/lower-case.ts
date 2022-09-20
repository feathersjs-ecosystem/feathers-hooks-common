import _set from 'lodash/set.js';
import { BadRequest } from '@feathersjs/errors';

import { transformItems } from '../common';
import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import type { HookFunction } from '../types';

/**
 * Convert certain field values to lower case.
 * {@link https://hooks-common.feathersjs.com/hooks.html#lowercase}
 */
export function lowerCase (...fieldNames: string[]): HookFunction {
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
