import type { Application, Hook, Service } from '@feathersjs/feathers';
import { iffElse } from '..';
import type { PredicateFn } from '../types';

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#unless
 */
export function unless<A extends Application = Application, S extends Service = Service>(
  predicate: boolean | PredicateFn,
  ...hooks: Hook[]
): Hook<A, S> {
  // @ts-ignore
  return iffElse(predicate, undefined, hooks.slice());
}
