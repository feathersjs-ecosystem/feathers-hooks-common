import type { HookContext } from '@feathersjs/feathers'
import type { PredicateFn } from '../../types.js'
import { isPromise } from '../../common/index.js'

/**
 * Return the or of a series of sync or async predicate functions.
 * @see https://hooks-common.feathersjs.com/utilities.html#some
 */
export const some =
  <H extends HookContext = HookContext>(
    ...predicates: (PredicateFn<H> | undefined)[]
  ): PredicateFn<H> =>
  (context: H): boolean | Promise<boolean> => {
    if (!predicates.length) {
      // same as Array.prototype.some
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some#description
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

      if (result === true) {
        return true
      } else if (result === false) {
        continue
      } else if (isPromise(result)) {
        promises.push(result)
      }
    }

    if (everyUndefined) {
      // all predicates are undefined -> same as Array.prototype.some
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some#description
      return true
    }

    if (!promises.length) {
      // no promises returned -> all predicates are sync and false
      return false
    }

    return Promise.all(promises).then(results => results.some(result => !!result))
  }
