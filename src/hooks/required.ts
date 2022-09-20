import _get from 'lodash/get.js';
import { BadRequest } from '@feathersjs/errors';
import _has from 'lodash/has.js';

import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import type { HookFunction } from '../types';

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * {@link https://hooks-common.feathersjs.com/hooks.html#required}
 */
export function required (...fieldNames: string[]): HookFunction {
  return (context: any) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'required');
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      fieldNames.forEach(name => {
        if (!_has(item, name)) throw new BadRequest(`Field ${name} does not exist. (required)`);
        const value = _get(item, name);
        if (!value && value !== 0 && value !== false) throw new BadRequest(`Field ${name} is null. (required)`);
      });
    });
  };
}
