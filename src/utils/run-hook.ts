import type { Hook, HookContext, Paginated } from '@feathersjs/feathers';

/**
 * Let's you call a hook right after the service call. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#runhook}
 */
export function runHook (
  context?: HookContext
): (hook: Hook) => (data: any[] | Paginated<any>) => Promise<any> {
  const extraContent = context; // cannot access extraContent1 below. why not?

  return (hookFunc: any) => (result: any) => {
    const ctx = Object.assign({}, { type: 'after', params: {}, result }, extraContent);

    if (typeof result === 'object' && result !== null && result.total && result.data) {
      // @ts-expect-error method is readonly
      ctx.method = 'find';
    }

    return Promise.resolve()
      .then(() => hookFunc(ctx))
      .then(newContext => {
        if (newContext === undefined) { return; }

        const result = newContext.result;

        if (typeof result === 'object' && result !== null && result.total && result.data) { // find
          return newContext.result;
        }

        return newContext.result.data || newContext.result;
      });
  };
}
