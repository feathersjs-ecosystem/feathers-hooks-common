import getByDot from 'lodash/get';
import errors from '@feathersjs/errors';
import existsByDot from 'lodash/has';

import {checkContext} from '../utils/check-context';
import {getItems} from '../utils/get-items';
import { Hook } from '@feathersjs/feathers';

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
        if (!existsByDot(item, name)) throw new errors.BadRequest(`Field ${name} does not exist. (required)`);
        const value = getByDot(item, name);
        if (!value && value !== 0 && value !== false) throw new errors.BadRequest(`Field ${name} is null. (required)`);
      });
    });
  };
}
