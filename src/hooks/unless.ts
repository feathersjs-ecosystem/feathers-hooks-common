import type { HookContext } from '@feathersjs/feathers';
import { iffElse } from '..';
import type { PredicateFn, HookFunction } from '../types';

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#unless
 */
export function unless<H extends HookContext = HookContext>(
  predicate: boolean | PredicateFn,
  ...hooks: HookFunction<H>[]
) {
  // @ts-ignore
  return iffElse(predicate, undefined, hooks.slice());
}
