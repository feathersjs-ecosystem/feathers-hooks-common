import _set from 'lodash/set.js';
import { alterResult } from '../alter-items/alter-result';

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export const setNowResult = (...fieldNames: string[]) =>
  alterResult(data => {
    for (let i = 0; i < fieldNames.length; i++) {
      const key = fieldNames[i];

      _set(data, key, new Date());
    }
  });
