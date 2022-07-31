import type { Hook } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';
import { checkContext } from '../utils/check-context';

/**
 * Delete certain fields from the query object.
 * {@link https://hooks-common.feathersjs.com/hooks.html#discardquery}
 */
export function discardQuery (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContext(context, 'before', null, 'discardQuery');

    const query = (context.params || {}).query || {};

    context.params.query = _omit(query, fieldNames);

    return context;
  };
}
