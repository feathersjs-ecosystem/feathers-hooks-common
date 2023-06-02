import _get from 'lodash/get.js';
import _has from 'lodash/has.js';
import { BadRequest } from '@feathersjs/errors';

import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import type { HookContext, NextFunction } from '@feathersjs/feathers';

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * @see https://hooks-common.feathersjs.com/hooks.html#required
 */
export function required<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H, next?: NextFunction) => {
    checkContext(context, ['before', 'around'], ['create', 'update', 'patch'], 'required');
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      fieldNames.forEach(name => {
        if (!_has(item, name)) throw new BadRequest(`Field ${name} does not exist. (required)`);
        const value = _get(item, name);
        if (!value && value !== 0 && value !== false)
          throw new BadRequest(`Field ${name} is null. (required)`);
      });
    });

    if (next) {
      return next();
    }

    return context;
  };
}
