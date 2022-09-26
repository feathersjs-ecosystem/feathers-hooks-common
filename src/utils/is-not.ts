import { MethodNotAllowed } from '@feathersjs/errors';
import type { Application, Service } from '@feathersjs/feathers';
import { isPromise } from '../common';
import type { PredicateFn } from '../types';

/**
 * Negate a sync or async predicate function.
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#isnot
 */
export function isNot<A extends Application, S extends Service = Service>(
  predicate: boolean | PredicateFn<A, S>
): PredicateFn<A, S> {
  if (typeof predicate !== 'function') {
    throw new MethodNotAllowed('Expected function as param. (isNot)');
  }

  return context => {
    const result = predicate(context); // Should we pass a clone? (safety vs performance)

    if (!isPromise(result)) {
      return !result;
    }

    return result.then(result1 => !result1);
  };
}
