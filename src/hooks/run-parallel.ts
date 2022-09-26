import { BadRequest } from '@feathersjs/errors';
import type { Application, Hook, HookContext, Service } from '@feathersjs/feathers';

/**
 * Run a hook in parallel to the other hooks and the service call.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#runparallel
 */
export function runParallel<A extends Application = Application, S extends Service = Service>(
  hook: Hook<A, S>,
  clone?: (item: HookContext<A, S>) => HookContext<A, S>
): Hook<A, S> {
  if (typeof hook !== 'function') {
    throw new BadRequest('Function not provided. (runParallel)');
  }

  return function (this: any, context: HookContext<A, S>) {
    // must use function
    const copy = clone ? clone(context) : context;

    setTimeout(() => hook.call(this, copy));
  };
}
