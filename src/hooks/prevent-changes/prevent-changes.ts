import _has from 'lodash/has.js';
import _omit from 'lodash/omit.js';
import { BadRequest, FeathersError } from '@feathersjs/errors';
import { alterData } from '../alter-items/alter-data';
import { MaybeArray, toArray } from '../../internal.utils';

export type PreventChangesOptions = {
  error?: boolean | ((item: any, name: string) => FeathersError);
};

/**
 * Prevent patch service calls from changing certain fields.
 * @see https://hooks-common.feathersjs.com/hooks.html#preventchanges
 */
export const preventChanges = (fieldNames: MaybeArray<string>, options?: PreventChangesOptions) => {
  const fieldNamesArr = toArray(fieldNames);

  return alterData(item => {
    if (options?.error) {
      for (let i = 0; i < fieldNamesArr.length; i++) {
        const name = fieldNamesArr[i];

        if (_has(item, name)) {
          const error =
            typeof options.error === 'function'
              ? options.error(item, name)
              : new BadRequest(`Field ${name} may not be patched. (preventChanges)`);

          throw error;
        }
      }

      item = _omit(item, fieldNamesArr);
    }

    return item;
  });
};
