import _omit from 'lodash/omit.js';
import { alterResult } from '../alter-items/alter-result';
import { MaybeArray } from '../../internal.utils';
import { DispatchOption } from '../../types';

export type OmitResultOptions = {
  dispatch?: DispatchOption;
};

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitResult = (fieldNames: MaybeArray<string>, options?: OmitResultOptions) =>
  alterResult((item: any) => _omit(item, fieldNames), { dispatch: options?.dispatch });

// alias
export { omitResult as discardResult };
