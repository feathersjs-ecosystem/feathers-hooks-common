import { Hook } from '@feathersjs/feathers';
import { iffElse } from '..';
import { PredicateFn } from '../types';

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Unless}
 */
export function unless (
  predicate: boolean | PredicateFn,
  ...hooks: Hook[]
): Hook {
  return iffElse(predicate, undefined, hooks.slice())
}
