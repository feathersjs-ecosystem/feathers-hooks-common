import _omit from 'lodash/omit.js';
import { alterData } from '../alter-items/alter-data';
import { MaybeArray, toArray } from '../../internal.utils';

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitData = (fieldNames: MaybeArray<string>) =>
  alterData((item: any) => _omit(item, toArray(fieldNames)));
