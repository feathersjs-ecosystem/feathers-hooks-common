import _set from 'lodash/set.js';
import { alterResult } from '../alter-items/alter-result';
import { MaybeArray, toArray } from '../../internal.utils';
import { DispatchOption } from '../../types';

type SetNowResultOptions = {
  dispatch?: DispatchOption;
};

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export const setNowResult = (fieldNames: MaybeArray<string>, options?: SetNowResultOptions) => {
  const fieldNamesArray = toArray(fieldNames);

  return alterResult(
    data => {
      for (let i = 0, n = fieldNamesArray.length; i < n; i++) {
        const key = fieldNamesArray[i];

        _set(data, key, new Date());
      }
    },
    { dispatch: options?.dispatch },
  );
};
