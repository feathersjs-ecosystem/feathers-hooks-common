import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { checkContext } from '../../utils';

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * @see https://hooks-common.feathersjs.com/hooks.html#stashbefore
 */
export function stashBefore<H extends HookContext = HookContext>(fieldName?: string) {
  const beforeField = fieldName || 'before';

  return async (context: H, next?: NextFunction) => {
    if (context.params.disableStashBefore) {
      return context;
    }

    checkContext(context, ['before', 'around'], ['update', 'patch', 'remove'], 'stashBefore');

    const isMulti = context.id == null;

    const params = {
      ...context.params,
      disableStashBefore: true,
      ...(isMulti ? { paginate: false } : {}),
    };

    await (!isMulti ? context.service.get(context.id, params) : context.service.find(params))
      .then((result: any) => {
        context.params[beforeField] = result;
        return context;
      })
      .catch(() => {
        return context;
      });

    if (next) {
      return await next();
    }

    return context;
  };
}
