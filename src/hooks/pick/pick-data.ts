import _pick from 'lodash/pick.js';

import { alterData } from '../alter-items/alter-data';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickData = (...fieldNames: string[]) =>
  alterData((item: any) => {
    if (typeof item !== 'object' || item === null) return item;

    return _pick(item, fieldNames);
  });

// alias
export { pickData as keepData };
