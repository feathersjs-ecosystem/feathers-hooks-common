import type { Hook } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

/**
 * Disables pagination when query.$limit is -1 or '-1'.
 * {@link https://hooks-common.feathersjs.com/hooks.html#disablepagination}
 */
export function disablePagination (): Hook {
  return function (context: any) {
    checkContext(context, 'before', ['find'], 'disablePagination');
    const $limit = (context.params.query || {}).$limit;

    if ($limit === '-1' || $limit === -1) {
      context.params.paginate = false;
      delete context.params.query.$limit;
    }

    return context;
  };
}
