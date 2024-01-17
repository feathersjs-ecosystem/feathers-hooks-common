import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { HookFunction } from '../types';

/**
 * Run a hook in parallel to the other hooks and the service call.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#runparallel
 */
export function runParallel<H extends HookContext = HookContext>(
  hook: HookFunction<H>,
  clone?: (item: H) => H,
) {
  if (typeof hook !== 'function') {
    throw new BadRequest('Function not provided. (runParallel)');
  }

  return function (this: any, context: H) {
    // must use function
    const copy = clone ? clone(context) : context;

    setTimeout(() => hook.call(this, copy as any));
  };
}
