import _get from 'lodash/get.js';
import { BadRequest } from '@feathersjs/errors';
import _has from 'lodash/has.js';

import { checkContext, getDataIsArray } from '../../utils';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * @see https://hooks-common.feathersjs.com/hooks.html#required
 */
export function required<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'required');

    const { data } = getDataIsArray(context);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      for (let j = 0; j < fieldNames.length; j++) {
        const name = fieldNames[j];

        if (!_has(item, name)) {
          throw new BadRequest(`Field ${name} does not exist. (required)`);
        }

        const value = _get(item, name);

        if (!value && value !== 0 && value !== false) {
          throw new BadRequest(`Field ${name} is null. (required)`);
        }
      }
    }
  };
}
