import { pluck } from '../common';
import type { HookFunction } from '../types';
import { checkContext } from '../utils/check-context';

/**
 * Keep certain fields in the query object, deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#keepquery}
 */
export function keepQuery (...fieldNames: string[]): HookFunction {
  return (context: any) => {
    checkContext(context, 'before', null, 'keepQuery');

    const query = (context.params || {}).query || {};
    context.params.query = pluck(query, fieldNames);

    return context;
  };
}
