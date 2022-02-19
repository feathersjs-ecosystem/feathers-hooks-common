import { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the and of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Every}
 */
export function every (...predicates: PredicateFn[]): AsyncPredicateFn {
  return function (this: any, ...fnArgs: any[]) {
    // @ts-ignore
    const promises = predicates.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.every(result => !!result));
    });
  };
}
