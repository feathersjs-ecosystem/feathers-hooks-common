import type { HookContext } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';

/**
 * Delete certain fields from the query object.
 * @see https://hooks-common.feathersjs.com/hooks.html#discardquery
 */
export function omitQuery<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    if (!context.params.query) {
      return context;
    }

    context.params.query = _omit(context.params.query, fieldNames);

    return context;
  };
}

export { omitQuery as discardQuery };
