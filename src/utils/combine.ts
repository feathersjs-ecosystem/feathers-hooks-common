import type { Application, Hook, HookContext, Service } from '@feathersjs/feathers';

/**
 * Sequentially execute multiple sync or async hooks.
 * @see https://hooks-common.feathersjs.com/utilities.html#combine
 */
export function combine<A extends Application = Application, S extends Service = Service>(
  ...serviceHooks: Hook<A, S>[]
): (context: HookContext<A, S>) => Promise<HookContext<A, S>> {
  const isContext = function (ctx: HookContext<A, S>) {
    return (
      typeof ctx === 'object' && typeof ctx.method === 'string' && typeof ctx.type === 'string'
    );
  };

  return function (context: HookContext<A, S>) {
    let ctx = context;

    const updateCurrentHook = (current: void | HookContext<A, S>) => {
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
    const promise = serviceHooks.reduce((current, fn: Hook<A, S>) => {
      // @ts-ignore
      const hook = fn.bind(this);

      // Use the returned hook object or the old one
      // @ts-ignore
      return current.then(currentHook => hook(currentHook)).then(updateCurrentHook);
    }, Promise.resolve(ctx));

    return promise
      .then(() => ctx)
      .catch(error => {
        // Add the hook information to any errors
        error.hook = ctx;
        throw error;
      });
  };
}
