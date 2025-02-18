import type { HookContext } from '@feathersjs/feathers';
import type { PredicateFn } from '../../types';
import { isPromise } from '../../common';

/**
 * Return the or of a series of sync or async predicate functions.
 * @see https://hooks-common.feathersjs.com/utilities.html#some
 */
export const some =
  <H extends HookContext = HookContext>(...predicates: PredicateFn<H>[]): PredicateFn<H> =>
  (context: H): boolean | Promise<boolean> => {
    if (!predicates.length) {
      // same as Array.prototype.some
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some#description
      return true;
    }

    const promises: Promise<boolean>[] = [];

    for (const predicate of predicates) {
      const result = predicate(context);

      if (result === true) {
        return true;
      } else if (result === false) {
        continue;
      } else if (isPromise(result)) {
        promises.push(result);
      }
    }

    if (!promises.length) {
      // no promises returned -> all predicates are sync and false
      return false;
    }

    return Promise.all(promises).then(results => results.some(result => !!result));
  };
