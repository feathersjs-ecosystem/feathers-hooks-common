import _set from 'lodash/set';
import _capitalize from 'lodash/capitalize';
import { BadRequest } from '@feathersjs/errors';

import { transformItems } from '../common';
import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import type { Hook } from '@feathersjs/feathers';

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 * {@link https://hooks-common.feathersjs.com/hooks.html#capitalize}
 */
export function capitalize (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'lowercase');

    transformItems(getItems(context), fieldNames, (item: any, fieldName: any, value: any) => {
      if (typeof value !== 'string' && value !== null) {
        throw new BadRequest(`Expected string data. (lowercase ${fieldName})`);
      }

      _set(item, fieldName, value ? _capitalize(value) : value);
    });

    return context;
  };
}
