import type { HookContext } from '@feathersjs/feathers';
import type { HookFunction } from '../../types';

/**
 * Sequentially execute multiple sync or async hooks.
 * @see https://hooks-common.feathersjs.com/utilities.html#combine
 */
export function combine<H extends HookContext = HookContext>(...serviceHooks: HookFunction<H>[]) {
  // if (serviceHooks.length && Array.isArray(serviceHooks[0])) {
  //   serviceHooks = serviceHooks[0];
  // }

  const isContext = function (ctx: H) {
    return typeof ctx?.method === 'string' && typeof ctx?.type === 'string';
  };

  return async function (context: H) {
    let ctx = context;

    const updateCurrentHook = (current: void | H) => {
      // Either use the returned hook object or the current
      // hook object from the chain if the hook returned undefined
      if (current) {
        if (!isContext(current)) {
          throw new Error(
            `${ctx.type} hook for '${ctx.method}' method returned invalid hook object`,
          );
        }

        ctx = current;
      }

      return ctx;
    };

    // Go through all hooks and chain them into our promise

    // @ts-expect-error TODO
    const promise = serviceHooks.reduce(async (current, fn) => {
      // @ts-expect-error TODO
      const hook = fn.bind(this);

      // Use the returned hook object or the old one

      const currentHook = await current;
      const currentCtx = await hook(currentHook);
      return updateCurrentHook(currentCtx);
    }, Promise.resolve(ctx));

    try {
      await promise;
      return ctx;
    } catch (error: any) {
      // Add the hook information to any errors
      error.hook = ctx;
      throw error;
    }
  };
}
