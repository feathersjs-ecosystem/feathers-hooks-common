import _has from 'lodash/has.js';
import _omit from 'lodash/omit.js';

import { checkContext } from '../utils/check-context';
import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Prevent patch service calls from changing certain fields.
 * @see https://hooks-common.feathersjs.com/hooks.html#preventchanges
 */
export function preventChanges<H extends HookContext = HookContext>(
  ifThrow: boolean,
  ...fieldNames: string[]
) {
  if (typeof ifThrow === 'string') {
    // eslint-disable-next-line no-console
    console.warn('**Deprecated** Use the preventChanges(true, ...fieldNames) syntax instead.');
    fieldNames = [ifThrow, ...fieldNames];
  }

  return (context: H) => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    let data = { ...context.data };

    fieldNames.forEach(name => {
      if (_has(data, name)) {
        if (ifThrow) {
          throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        }
        // Delete data.contactPerson.name
        // @ts-ignore
        data = _omit(data, name);
      }
    });

    context.data = data;

    return context;
  };
}
