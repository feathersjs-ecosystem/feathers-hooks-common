import { iffElse } from '..';
import type { HookFunction, PredicateFn } from '../types';

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 * {@link https://hooks-common.feathersjs.com/hooks.html#unless}
 */
export function unless (
  predicate: boolean | PredicateFn,
  ...hooks: HookFunction[]
): HookFunction {
  return iffElse(predicate, undefined, hooks.slice())
}
