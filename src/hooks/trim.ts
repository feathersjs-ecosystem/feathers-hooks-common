import _set from 'lodash/set';
import { BadRequest } from '@feathersjs/errors';

import { transformItems } from '../common';
import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import type { Hook } from '@feathersjs/feathers';

/**
 * Removes leading and trailing whitespace or specified characters from string.
 * {@link https://hooks-common.feathersjs.com/hooks.html#trim}
 */
export function trim (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'trim');

    transformItems(getItems(context), fieldNames, (item: any, fieldName: any, value: any) => {
      if (typeof value !== 'string' && value !== null) {
        throw new BadRequest(`Expected string data. (lowercase ${fieldName})`);
      }

      _set(item, fieldName, value ? value.trim() : value);
    });

    return context;
  };
}
