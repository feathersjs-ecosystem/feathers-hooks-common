import _has from 'lodash/has.js';
import _omit from 'lodash/omit.js';

import { checkContext } from '../utils/check-context';
import errors from '@feathersjs/errors';
const { BadRequest } = errors;
import type { Hook } from '@feathersjs/feathers';

/**
 * Prevent patch service calls from changing certain fields.
 * {@link https://hooks-common.feathersjs.com/hooks.html#preventchanges}
 */
export function preventChanges (
  ifThrow: boolean,
  ...fieldNames: string[]
): Hook {
  if (typeof ifThrow === 'string') {
    // eslint-disable-next-line no-console
    console.warn('**Deprecated** Use the preventChanges(true, ...fieldNames) syntax instead.');
    fieldNames = [ifThrow, ...fieldNames]
  }

  return (context: any) => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    let data = { ...context.data };

    fieldNames.forEach(name => {
      if (_has(data, name)) {
        if (ifThrow) {
          throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        }
        // Delete data.contactPerson.name
        data = _omit(data, name);
      }
    });

    return { ...context, data };
  };
}
