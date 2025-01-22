import _pick from 'lodash/pick.js';

import { alterResult } from '../alter-items/alter-result';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickResult = (...fieldNames: string[]) =>
  alterResult((item: any) => {
    if (typeof item !== 'object' || item === null) return item;

    return _pick(item, fieldNames);
  });

// alias
export { pickResult as keepResult };
