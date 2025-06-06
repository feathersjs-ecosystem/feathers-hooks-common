import _get from 'lodash/get.js'
import _set from 'lodash/set.js'
import { BadRequest } from '@feathersjs/errors'
import { transformData } from '../transform/transform-data.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

/**
 * Convert certain field values to lower case.
 * @see https://hooks-common.feathersjs.com/hooks.html#lowercase
 */
export const lowercaseData = (fieldNames: MaybeArray<string>) => {
  const fieldNamesArr = toArray(fieldNames)
  return transformData(item => {
    for (let i = 0; i < fieldNamesArr.length; i++) {
      const fieldName = fieldNamesArr[i]
      const value = _get(item, fieldName)

      if (value == null) {
        continue
      }

      if (typeof value !== 'string') {
        throw new BadRequest(`Expected string data. (lowercase ${fieldName})`)
      }

      _set(item, fieldName, value.toLowerCase())
    }
  })
}
