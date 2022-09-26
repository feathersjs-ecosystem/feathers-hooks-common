import type { Application, Hook, Service } from '@feathersjs/feathers';
import { pluck } from '../common';
import { checkContext } from '../utils/check-context';

/**
 * Keep certain fields in the query object, deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepquery
 */
export function keepQuery<A extends Application = Application, S extends Service = Service>(
  ...fieldNames: string[]
): Hook<A, S> {
  return context => {
    checkContext(context, 'before', null, 'keepQuery');

    const query = context.params.query || {};
    context.params.query = pluck(query, fieldNames);

    return context;
  };
}
