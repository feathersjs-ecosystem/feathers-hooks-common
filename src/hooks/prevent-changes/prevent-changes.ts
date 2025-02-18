import _has from 'lodash/has.js';
import _omit from 'lodash/omit.js';
import { BadRequest } from '@feathersjs/errors';
import { alterData } from '../alter-items/alter-data';

/**
 * Prevent patch service calls from changing certain fields.
 * @see https://hooks-common.feathersjs.com/hooks.html#preventchanges
 */
export const preventChanges = (ifThrow: boolean, ...fieldNames: string[]) =>
  alterData(item => {
    for (let i = 0; i < fieldNames.length; i++) {
      const name = fieldNames[i];

      if (_has(item, name)) {
        if (ifThrow) {
          throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        }

        item = _omit(item, name);
      }
    }

    return item;
  });
