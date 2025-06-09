import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'
import { transformData } from '../transform/transform-data.js'
import _set from 'lodash/set.js'

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export const setNowData = (fieldNames: MaybeArray<string>) => {
  const fieldNamesArr = toArray(fieldNames)

  return transformData(data => {
    for (let i = 0; i < fieldNamesArr.length; i++) {
      const key = fieldNamesArr[i]

      _set(data, key, new Date())
    }
  })
}
