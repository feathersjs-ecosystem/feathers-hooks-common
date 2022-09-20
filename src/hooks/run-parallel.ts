import { BadRequest } from '@feathersjs/errors';
import type { HookFunction } from '../types';

/**
 * Run a hook in parallel to the other hooks and the service call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#runparallel}
 */
export function runParallel <T = any> (
  hook: HookFunction,
  clone: (item: T) => T,
  cloneDepth = 6
): HookFunction {
  if (typeof hook !== 'function') {
    throw new BadRequest('Function not provided. (runParallel)');
  }

  return function (this: any, context: any) { // must use function
    const copy = cloneDepth ? clone(context) : context;

    setTimeout(() => hook.call(this, copy));
  };
}
