import { MethodNotAllowed } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import { isPromise } from '../common';
import type { PredicateFn } from '../types';

/**
 * Negate a sync or async predicate function.
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#isnot
 */
export function isNot<H extends HookContext = HookContext>(
  predicate: boolean | PredicateFn<H>,
): PredicateFn<H> {
  if (typeof predicate !== 'function') {
    throw new MethodNotAllowed('Expected function as param. (isNot)');
  }

  return (context: H) => {
    const result = predicate(context); // Should we pass a clone? (safety vs performance)

    if (!isPromise(result)) {
      return !result;
    }

    return result.then(result1 => !result1);
  };
}
