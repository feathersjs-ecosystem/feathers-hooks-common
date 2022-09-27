import type { HookContext } from '@feathersjs/feathers';
import { pluck } from '../common';
import { checkContext } from '../utils/check-context';

/**
 * Keep certain fields in the query object, deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepquery
 */
export function keepQuery<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    checkContext(context, 'before', null, 'keepQuery');

    const query = context.params.query || {};
    context.params.query = pluck(query, fieldNames);

    return context;
  };
}
