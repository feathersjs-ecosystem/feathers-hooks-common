import getByDot from 'lodash/get';
import { BadRequest } from '@feathersjs/errors';
import existsByDot from 'lodash/has';

import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import type { Hook } from '@feathersjs/feathers';

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Required}
 */
export function required (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'required');
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      fieldNames.forEach(name => {
        if (!existsByDot(item, name)) throw new BadRequest(`Field ${name} does not exist. (required)`);
        const value = getByDot(item, name);
        if (!value && value !== 0 && value !== false) throw new BadRequest(`Field ${name} is null. (required)`);
      });
    });
  };
}
