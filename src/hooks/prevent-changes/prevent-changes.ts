import _has from 'lodash/has.js'
import _omit from 'lodash/omit.js'
import type { FeathersError } from '@feathersjs/errors'
import { BadRequest } from '@feathersjs/errors'
import { transformData } from '../transform/transform-data.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

export type PreventChangesOptions = {
  error?: boolean | ((item: any, name: string) => FeathersError)
}

/**
 * Prevent patch service calls from changing certain fields.
 * @see https://hooks-common.feathersjs.com/hooks.html#preventchanges
 */
export const preventChanges = (fieldNames: MaybeArray<string>, options?: PreventChangesOptions) => {
  const fieldNamesArr = toArray(fieldNames)

  return transformData(item => {
    if (options?.error) {
      for (let i = 0; i < fieldNamesArr.length; i++) {
        const name = fieldNamesArr[i]

        if (_has(item, name)) {
          const error =
            typeof options.error === 'function'
              ? options.error(item, name)
              : new BadRequest(`Field ${name} may not be patched. (preventChanges)`)

          throw error
        }
      }
    } else {
      item = _omit(item, fieldNamesArr)
    }

    return item
  })
}
