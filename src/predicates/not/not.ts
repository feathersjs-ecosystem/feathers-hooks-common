import type { HookContext } from '@feathersjs/feathers';
import { isPromise } from '../../common';
import type { PredicateFn } from '../../types';

/**
 * Negate a predicate function.
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#isnot
 */
export const not =
  <H extends HookContext = HookContext>(predicate: PredicateFn<H>): PredicateFn<H> =>
  (context: H) => {
    const result = predicate(context);

    if (!isPromise(result)) {
      return !result;
    }

    return result.then(result1 => !result1);
  };

// alias
export { not as isNot };
