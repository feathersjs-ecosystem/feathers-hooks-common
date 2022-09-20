import type { Application, HookContext, Service } from '@feathersjs/feathers';
import { iffElse } from './iff-else';
import type { HookFunction, IffHook, PredicateFn } from '../types';

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#iff}
 */
export function iff <A extends Application = Application, S extends Service = Service> (
  predicate: boolean | PredicateFn,
  ...hooks: HookFunction<A, S>[]
): IffHook<A, S> {
  const iffWithoutElse = function (context: HookContext<A, S>) {
    return iffElse(predicate, hooks.slice())(context);
  }

  iffWithoutElse.else = (...falseHooks: any[]) => (context: HookContext<A, S>) => iffElse(predicate, hooks.slice(), falseHooks.slice())(context);

  return iffWithoutElse;
}
