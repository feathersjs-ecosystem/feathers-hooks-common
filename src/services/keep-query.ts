import { Hook } from '@feathersjs/feathers';
import _pluck from '../common/_pluck';
import {checkContext} from './check-context';

/**
 * Keep certain fields in the query object, deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#KeepQuery}
 */
export function keepQuery (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContext(context, 'before', null, 'keepQuery');

    const query = (context.params || {}).query || {};
    context.params.query = _pluck(query, fieldNames);

    return context;
  };
}
