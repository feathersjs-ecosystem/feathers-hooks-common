import errors from '@feathersjs/errors';
const { MethodNotAllowed } = errors;
import { isPromise } from '../common';
import type { PredicateFn } from '../types';

/**
 * Negate a sync or async predicate function.
 * {@link https://hooks-common.feathersjs.com/hooks.html#isnot}
 */
export function isNot (
  predicate: boolean | PredicateFn
): PredicateFn {
  if (typeof predicate !== 'function') {
    throw new MethodNotAllowed('Expected function as param. (isNot)');
  }

  return (context: any) => {
    const result = predicate(context); // Should we pass a clone? (safety vs performance)

    if (!isPromise(result)) {
      return !result;
    }

    return result.then(result1 => !result1);
  };
}
