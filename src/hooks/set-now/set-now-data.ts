import { alterData } from '../alter-items/alter-data';
import _set from 'lodash/set.js';

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export const setNowData = (...fieldNames: string[]) =>
  alterData(data => {
    for (let i = 0; i < fieldNames.length; i++) {
      const key = fieldNames[i];

      _set(data, key, new Date());
    }
  });
