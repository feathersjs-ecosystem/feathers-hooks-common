import { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the or of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Some}
 */
export function some (...rest: PredicateFn[]): AsyncPredicateFn {
  return function (this: any, ...fnArgs: any[]) {
    // @ts-ignore
    const promises = rest.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.some(result => !!result));
    });
  };
}
