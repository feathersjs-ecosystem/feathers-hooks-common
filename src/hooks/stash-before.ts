import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * @see https://hooks-common.feathersjs.com/hooks.html#stashbefore
 */
export function stashBefore<H extends HookContext = HookContext>(fieldName?: string) {
  const beforeField = fieldName || 'before';

  return (context: H) => {
    checkContext(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    // @ts-ignore
    if (context.params.disableStashBefore) {
      return context;
    }

    if ((context.id === null || context.id === undefined) && !context.params.query) {
      throw new BadRequest('Id is required. (stashBefore)');
    }

    const params =
      context.method === 'get'
        ? context.params
        : {
            provider: context.params.provider,
            // @ts-ignore
            authenticated: context.params.authenticated,
            // @ts-ignore
            user: context.params.user,
          };

    return context.service
      .get(context.id, {
        ...params,
        // @ts-ignore
        query: params.query || {},
        // @ts-ignore
        disableStashBefore: true,
      })
      .then((data: any) => {
        // @ts-ignore
        context.params[beforeField] = JSON.parse(JSON.stringify(data));
        return context;
      })
      .catch(() => context);
  };
}
