import type { Hook, HookContext } from '@feathersjs/feathers';
import { isPromise } from '../common';
import { combine } from '../utils/combine';
import type { PredicateFn } from '../types';

/**
 * Execute one array of hooks or another based on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#iffelse}
 */
export function iffElse (
  predicate: boolean | PredicateFn,
  trueHooks: Hook | Hook[] | undefined,
  falseHooks?: Hook | Hook[] | undefined
): Hook {
  // fnArgs is [context] for service & permission hooks, [data, connection, context] for event filters
  return function (this: any, ctx: HookContext) {
    if (typeof trueHooks === 'function') { trueHooks = [trueHooks]; }
    if (typeof falseHooks === 'function') { falseHooks = [falseHooks]; }

    const that = this;
    const check = typeof predicate === 'function' ? predicate.apply(that, [ctx]) : !!predicate;

    if (!check) {
      return callHooks.call(that, ctx, falseHooks)
    }

    if (!isPromise(check)) {
      return callHooks.call(that, ctx, trueHooks);
    }

    return check.then((check1: any) => {
      const hooks = check1 ? trueHooks : falseHooks;
      return callHooks.call(that, ctx, hooks as Hook[])
    });
  };
}

function callHooks (this: any, ctx: HookContext, serviceHooks?: Hook[]) {
  let hooks = serviceHooks
  if (serviceHooks && serviceHooks.length && Array.isArray(serviceHooks[0])) {
    hooks = serviceHooks[0];
  }

  return hooks ? combine(...hooks).call(this, ctx) : ctx;
}
