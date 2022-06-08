import errors from '@feathersjs/errors';
const { BadRequest } = errors;
import type { Hook } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#stashbefore}
 */
export function stashBefore (fieldName?: string): Hook {
  const beforeField = fieldName || 'before';

  return (context: any) => {
    checkContext(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    if (context.params.disableStashBefore) {
      return context;
    }

    if ((context.id === null || context.id === undefined) && !context.params.query) {
      throw new BadRequest('Id is required. (stashBefore)');
    }

    const params = context.method === 'get'
      ? context.params
      : {
        provider: context.params.provider,
        authenticated: context.params.authenticated,
        user: context.params.user
      };

    return context.service.get(context.id, {
      ...params,
      query: params.query || {},
      disableStashBefore: true
    })
      .then((data: any) => {
        context.params[beforeField] = JSON.parse(JSON.stringify(data));
        return context;
      })
      .catch(() => context);
  };
}
