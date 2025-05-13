import _pick from 'lodash/pick.js';
import { alterData } from '../alter-items/alter-data';
import { MaybeArray, toArray } from '../../internal.utils';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickData = (fieldNames: MaybeArray<string>) => {
  const fieldNamesArr = toArray(fieldNames);
  return alterData((item: any) => {
    if (typeof item !== 'object' || item === null) return item;

    return _pick(item, fieldNamesArr);
  });
};
