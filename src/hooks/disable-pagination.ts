import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

/**
 * Disables pagination when query.$limit is -1 or '-1'.
 * @see https://hooks-common.feathersjs.com/hooks.html#disablepagination
 */
export const disablePagination =
  <H extends HookContext = HookContext>() =>
  (context: H, next?: NextFunction) => {
    checkContext(context, ['before', 'around'], ['find'], 'disablePagination');
    const $limit = context.params?.query?.$limit;

    if ($limit === '-1' || $limit === -1) {
      // @ts-ignore
      context.params.paginate = false;
      delete context.params.query.$limit;
    }

    if (next) {
      return next();
    }

    return context;
  };
