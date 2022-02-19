import type { Hook } from '@feathersjs/feathers';
import omit from 'lodash/omit';
import { checkContext } from '../utils/check-context';

/**
 * Delete certain fields from the query object.
 * {@link https://hooks-common.feathersjs.com/hooks.html#DiscardQuery}
 */
export function discardQuery (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContext(context, 'before', null, 'discardQuery');

    const query = (context.params || {}).query || {};

    context.params.query = omit(query, fieldNames);

    return context;
  };
}
