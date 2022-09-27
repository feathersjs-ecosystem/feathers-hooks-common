import _set from 'lodash/set.js';
import { BadRequest } from '@feathersjs/errors';

import { transformItems } from '../common';
import { checkContextIf } from '../utils/check-context-if';
import { getItems } from '../utils/get-items';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Convert certain field values to lower case.
 * @see https://hooks-common.feathersjs.com/hooks.html#lowercase
 */
export function lowerCase<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
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
