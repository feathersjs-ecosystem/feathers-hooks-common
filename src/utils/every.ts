import type { HookContext } from '@feathersjs/feathers';
import type { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the and of a series of sync or async predicate functions.
 * @see https://hooks-common.feathersjs.com/utilities.html#every
 */
export function every<H extends HookContext = HookContext>(
  ...predicates: PredicateFn<H>[]
): AsyncPredicateFn<H> {
  return async function (this: any, ...fnArgs: any[]) {
    // @ts-ignore
    const promises = predicates.map(fn => fn.apply(this, fnArgs));

    const results = await Promise.all(promises);
    return await Promise.resolve(results.every(result => !!result));
  };
}
