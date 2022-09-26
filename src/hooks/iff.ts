import type { Application, Hook, HookContext, Service } from '@feathersjs/feathers';
import { iffElse } from './iff-else';
import type { PredicateFn } from '../types';

export interface IffHook<A = Application, S = Service> extends Hook<A, S> {
  else(...hooks: Hook<A, S>[]): Hook<A, S>;
}

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * @see https://hooks-common.feathersjs.com/hooks.html#iff
 */
export function iff<A extends Application = Application, S extends Service = Service>(
  predicate: boolean | PredicateFn,
  ...hooks: Hook<A, S>[]
): IffHook<A, S> {
  const iffWithoutElse = function (context: HookContext<A, S>) {
    // @ts-ignore
    return iffElse(predicate, hooks.slice())(context);
  };

  iffWithoutElse.else =
    (...falseHooks: any[]) =>
    (context: HookContext<A, S>) =>
      // @ts-ignore
      iffElse(predicate, hooks.slice(), falseHooks.slice())(context);

  return iffWithoutElse;
}

export { iff as when };
