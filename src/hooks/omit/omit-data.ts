import _omit from 'lodash/omit.js';
import { alterData } from '../alter-items/alter-data';

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitData = (...fieldNames: string[]) =>
  alterData((item: any) => _omit(item, fieldNames));

// alias
export { omitData as discardData };
