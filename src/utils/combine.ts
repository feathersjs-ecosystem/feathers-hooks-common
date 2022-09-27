import type { HookContext } from '@feathersjs/feathers';
import type { HookFunction } from '../types';

/**
 * Sequentially execute multiple sync or async hooks.
 * @see https://hooks-common.feathersjs.com/utilities.html#combine
 */
export function combine<H extends HookContext = HookContext>(...serviceHooks: HookFunction<H>[]) {
  const isContext = function (ctx: H) {
    return (
      typeof ctx === 'object' && typeof ctx.method === 'string' && typeof ctx.type === 'string'
    );
  };

  return async function (context: H) {
    let ctx = context;

    const updateCurrentHook = (current: void | H) => {
      // Either use the returned hook object or the current
      // hook object from the chain if the hook returned undefined
      if (current) {
        if (!isContext(current)) {
          throw new Error(
            `${ctx.type} hook for '${ctx.method}' method returned invalid hook object`
          );
        }

        ctx = current;
      }

      return ctx;
    };

    // Go through all hooks and chain them into our promise
    const promise = serviceHooks.reduce((current, fn) => {
      // @ts-ignore
      const hook = fn.bind ? fn.bind(this) : fn;

      // Use the returned hook object or the old one
      // @ts-ignore
      return current.then(currentCtx => hook(currentCtx)).then(updateCurrentHook);
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
