import existsByDot from 'lodash/has';
import omit from 'lodash/omit';

import { checkContext } from '../utils/check-context';
import { BadRequest } from '@feathersjs/errors';
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
    const data = context.data;

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        if (ifThrow) {
          throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        }
        // Delete data.contactPerson.name
        context.data = omit(data, name);
      }
      // Delete data['contactPerson.name']
      if (data[name]) {
        if (ifThrow) throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        delete data[name];
      }
    });

    return context;
  };
}
