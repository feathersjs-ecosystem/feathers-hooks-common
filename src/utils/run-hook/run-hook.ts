import type { HookContext, Paginated } from '@feathersjs/feathers';

/**
 * Let's you call a hook right after the service call. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#runhook
 */
export function runHook<H extends HookContext = HookContext>(
  context?: H,
): (hook: any) => (data: any[] | Paginated<any>) => Promise<any> {
  const extraContent = context; // cannot access extraContent1 below. why not?

  return hookFunc => result => {
    const ctx = Object.assign({}, { type: 'after', params: {}, result }, extraContent);

    // @ts-ignore
    if (typeof result === 'object' && result !== null && result.total && result.data) {
      // @ts-expect-error method is readonly
      ctx.method = 'find';
    }

    return (
      Promise.resolve()
        // @ts-ignore
        .then(() => hookFunc(ctx))
        .then(newContext => {
          if (!newContext) {
            return;
          }

          const result = newContext.result;

          if (typeof result === 'object' && result !== null && result.total && result.data) {
            // find
            return newContext.result;
          }

          return newContext.result.data || newContext.result;
        })
    );
  };
}
