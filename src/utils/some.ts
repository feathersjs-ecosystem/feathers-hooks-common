import { HookContext } from '@feathersjs/feathers';
import { AsyncPredicateFn, PredicateFn } from '../types';

/**
 * Return the or of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Some}
 */
export function some (
  ...predicates: PredicateFn[]
): AsyncPredicateFn {
  return async function (this: any, context: HookContext) {
    const promises = predicates.map(fn => fn.apply(this, [context]));

    const results = await Promise.all(promises);
    return await Promise.resolve(results.some(result => !!result));
  };
}
