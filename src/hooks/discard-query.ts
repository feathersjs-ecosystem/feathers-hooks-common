import type { Application, Hook, Service } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';
import { checkContext } from '../utils/check-context';

/**
 * Delete certain fields from the query object.
 * @see https://hooks-common.feathersjs.com/hooks.html#discardquery
 */
export function discardQuery<A extends Application = Application, S extends Service = Service>(
  ...fieldNames: string[]
): Hook<A, S> {
  return context => {
    checkContext(context, 'before', null, 'discardQuery');

    const query = context.params.query || {};

    context.params.query = _omit(query, fieldNames);

    return context;
  };
}
