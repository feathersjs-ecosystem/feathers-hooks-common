import type { HookContext } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

/**
 * Disables pagination when query.$limit is -1 or '-1'.
 * @see https://hooks-common.feathersjs.com/hooks.html#disablepagination
 */
export function disablePagination<H extends HookContext = HookContext>() {
  return (context: H) => {
    checkContext(context, 'before', ['find'], 'disablePagination');
    const $limit = (context.params.query || {}).$limit;

    if ($limit === '-1' || $limit === -1) {
      // @ts-ignore
      context.params.paginate = false;
      delete context.params.query.$limit;
    }

    return context;
  };
}
