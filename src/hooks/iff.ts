import type { Hook, HookContext } from '@feathersjs/feathers';
import { iffElse } from './iff-else';
import type { IffHook, PredicateFn } from '../types';

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#iff}
 */
export function iff (
  predicate: boolean | PredicateFn,
  ...hooks: Hook[]
): IffHook {
  const iffWithoutElse = function (context: HookContext) {
    return iffElse(predicate, hooks.slice(), undefined)(context);
  }
  iffWithoutElse.else = (...falseHooks: any[]) => iffElse(true, falseHooks.slice(), []);

  return iffWithoutElse;
}
