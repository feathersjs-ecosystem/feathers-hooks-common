import type { HookContext } from '@feathersjs/feathers';
import { iffElse } from './iff-else';
import type { HookFunction, PredicateFn } from '../types';

export interface IffHook<H extends HookContext = HookContext> extends HookFunction<H> {
  else(...hooks: HookFunction<H>[]): HookFunction<H>;
}

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * @see https://hooks-common.feathersjs.com/hooks.html#iff
 */
export function iff<H extends HookContext = HookContext>(
  predicate: boolean | PredicateFn<H>,
  ...hooks: HookFunction<H>[]
): IffHook<H> {
  if (hooks.length && Array.isArray(hooks[0])) {
    hooks = hooks[0];
  }

  const iffWithoutElse = function (context: H) {
    return iffElse(predicate, hooks.slice())(context);
  };

  iffWithoutElse.else =
    (...falseHooks: any[]) =>
    (context: H) =>
      // @ts-ignore
      iffElse(predicate, hooks.slice(), falseHooks.slice())(context);

  return iffWithoutElse as IffHook<H>;
}

export { iff as when };
