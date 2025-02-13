import type { HookContext } from '@feathersjs/feathers';
import { checkContext } from '../../utils';

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * @see https://hooks-common.feathersjs.com/hooks.html#stashbefore
 */
export function stashBefore<H extends HookContext = HookContext>(fieldName?: string) {
  const beforeField = fieldName || 'before';

  return (context: H) => {
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

    return (!isMulti ? context.service.get(context.id, params) : context.service.find(params))
      .then((result: any) => {
        context.params[beforeField] = result;
        return context;
      })
      .catch(() => {
        return context;
      });
  };
}
