import type { HookContext } from '@feathersjs/feathers';
import { isPromise } from '../common';
import { combine } from '../utils/combine';
import type { HookFunction, PredicateFn } from '../types';

/**
 * Execute one array of hooks or another based on a sync or async predicate.
 * @see https://hooks-common.feathersjs.com/hooks.html#iffelse
 */
export function iffElse<H extends HookContext = HookContext>(
  predicate: boolean | PredicateFn<H>,
  trueHook: HookFunction<H> | HookFunction<H>[] | undefined,
  falseHook?: HookFunction<H> | HookFunction<H>[] | undefined,
) {
  // fnArgs is [context] for service & permission hooks, [data, connection, context] for event filters
  return function (this: any, ctx: H) {
    const trueHooks = Array.isArray(trueHook)
      ? trueHook
      : typeof trueHook === 'function'
        ? [trueHook]
        : undefined;

    const falseHooks = Array.isArray(falseHook)
      ? falseHook
      : typeof falseHook === 'function'
        ? [falseHook]
        : undefined;

    const that = this;
    const check = typeof predicate === 'function' ? predicate.apply(that, [ctx]) : !!predicate;

    if (!check) {
      return callHooks.call(that, ctx, falseHooks as any);
    }

    if (!isPromise(check)) {
      return callHooks.call(that, ctx, trueHooks as any);
    }

    return check.then((check1: any) => {
      const hooks = check1 ? trueHooks : falseHooks;
      return callHooks.call(that, ctx, hooks as any);
    });
  };
}

function callHooks<H extends HookContext = HookContext>(
  this: any,
  ctx: H,
  serviceHooks: HookFunction<H>[],
) {
  return serviceHooks ? combine(...serviceHooks).call(this, ctx) : ctx;
}
