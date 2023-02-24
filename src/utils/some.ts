import type { HookContext } from '@feathersjs/feathers';
import type { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the or of a series of sync or async predicate functions.
 * @see https://hooks-common.feathersjs.com/utilities.html#some
 */
export function some<H extends HookContext = HookContext>(
  ...predicates: PredicateFn<H>[]
): AsyncPredicateFn<H> {
  return async function (this: any, context: H) {
    const promises = predicates.map(fn => fn.apply(this, [context]));

    const results = await Promise.all(promises);
    return await Promise.resolve(results.some(result => !!result));
  };
}
