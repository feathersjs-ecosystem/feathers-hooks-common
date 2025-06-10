import type { HookContext } from '@feathersjs/feathers'
import type { PredicateFn } from '../../types.js'
import { isPromise } from '../../common/index.js'

/**
 * Return the and of a series of sync or async predicate functions.
 * @see https://hooks-common.feathersjs.com/utilities.html#every
 */
export const every =
  <H extends HookContext = HookContext>(
    ...predicates: (PredicateFn<H> | undefined)[]
  ): PredicateFn<H> =>
  (context: H): boolean | Promise<boolean> => {
    if (!predicates.length) {
      // same as Array.prototype.every
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every#description
      return true
    }

    const promises: Promise<boolean>[] = []

    let everyUndefined = true

    for (const predicate of predicates) {
      if (!predicate) {
        // skip undefined predicates
        continue
      } else {
        everyUndefined = false
      }

      const result = predicate(context)
      if (result === false) {
        return false
      } else if (isPromise(result)) {
        promises.push(result)
      }
    }

    if (everyUndefined) {
      // all predicates are undefined -> same as Array.prototype.every
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every#description
      return true
    }

    if (!promises.length) {
      // no promises returned -> all predicates are sync and true
      return true
    }

    return Promise.all(promises).then(results => results.every(result => !!result))
  }
