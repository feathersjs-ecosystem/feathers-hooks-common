import _pick from 'lodash/pick.js';

import { alterResult } from '../alter-items/alter-result';
import { DispatchOption } from '../../types';
import { MaybeArray } from '../../internal.utils';

export type PickResultOptions = {
  dispatch?: DispatchOption;
};

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickResult = (fieldNames: MaybeArray<string>, options?: PickResultOptions) =>
  alterResult(
    (item: any) => {
      if (typeof item !== 'object' || item === null) return item;

      return _pick(item, fieldNames);
    },
    { dispatch: options?.dispatch },
  );

// alias
export { pickResult as keepResult };
