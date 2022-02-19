import { Hook, HookContext } from '@feathersjs/feathers';
import { iffElse } from './iff-else';
import { IffHook, PredicateFn } from '../types';

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Iff}
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
