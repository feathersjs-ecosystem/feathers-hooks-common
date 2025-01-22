import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import { BadRequest } from '@feathersjs/errors';
import { alterData } from '../alter-items/alter-data';

/**
 * Convert certain field values to lower case.
 * @see https://hooks-common.feathersjs.com/hooks.html#lowercase
 */
export const lowercaseData = (...fieldNames: string[]) =>
  alterData(item => {
    for (let i = 0; i < fieldNames.length; i++) {
      const fieldName = fieldNames[i];
      const value = _get(item, fieldName);

      if (value == null) {
        continue;
      }

      if (typeof value !== 'string') {
        throw new BadRequest(`Expected string data. (lowercase ${fieldName})`);
      }

      _set(item, fieldName, value.toLowerCase());
    }
  });
