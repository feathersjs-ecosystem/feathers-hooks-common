import type { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the and of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#every}
 */
export function every (
  ...predicates: PredicateFn[]
): AsyncPredicateFn {
  return async function (this: any, ...fnArgs: any[]) {
    // @ts-ignore
    const promises = predicates.map(fn => fn.apply(this, fnArgs));

    const results = await Promise.all(promises);
    return await Promise.resolve(results.every(result => !!result));
  };
}
