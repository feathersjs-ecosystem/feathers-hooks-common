import _omit from 'lodash/omit.js';
import { alterResult } from '../alter-items/alter-result';

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitResult = (...fieldNames: string[]) =>
  alterResult((item: any) => _omit(item, fieldNames));

// alias
export { omitResult as discardResult };
