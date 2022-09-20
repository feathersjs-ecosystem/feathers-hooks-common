import type { Application, HookContext, Service } from '@feathersjs/feathers';
import { isPromise } from '../common';
import { combine } from '../utils/combine';
import type { HookFunction, PredicateFn } from '../types';

/**
 * Execute one array of hooks or another based on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#iffelse}
 */
export function iffElse <A extends Application = Application, S extends Service = Service> (
  predicate: boolean | PredicateFn<A, S>,
  trueHooks: HookFunction<A, S> | HookFunction<A, S>[] | undefined,
  falseHooks?: HookFunction<A, S> | HookFunction<A, S>[] | undefined
): HookFunction<A, S> {
  // fnArgs is [context] for service & permission hooks, [data, connection, context] for event filters
  // @ts-ignore
  return (this: any, ctx: HookContext<A, S>) => {

    if (typeof trueHooks === 'function') { trueHooks = [trueHooks]; }
    if (typeof falseHooks === 'function') { falseHooks = [falseHooks]; }

    // @ts-ignore
    const that = this;
    const check = typeof predicate === 'function' ? predicate.apply(that, [ctx]) : !!predicate;

    if (!check) {
      // @ts-ignore
      return callHooks.call(that, ctx, falseHooks)
    }

    if (!isPromise(check)) {
      // @ts-ignore
      return callHooks.call(that, ctx, trueHooks);
    }

    return check.then((check1: any) => {
      const hooks = check1 ? trueHooks : falseHooks;
      // @ts-ignore
      return callHooks.call(that, ctx, hooks as HookFunction<A, S>[])
    });
  };
}

function callHooks <
  A extends Application = Application,
  S extends Service = Service
> (this: any, ctx: HookContext<A, S>, serviceHooks?: HookFunction<A, S>[]) {
  let hooks = serviceHooks
  if (serviceHooks && serviceHooks.length && Array.isArray(serviceHooks[0])) {
    hooks = serviceHooks[0];
  }

  return hooks ? combine(...hooks).call(this, ctx) : ctx;
}
