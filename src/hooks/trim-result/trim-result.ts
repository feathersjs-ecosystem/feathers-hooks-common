import _get from 'lodash/get.js'
import _set from 'lodash/set.js'
import { BadRequest } from '@feathersjs/errors'
import { transformResult } from '../transform-result/transform-result.js'
import type { DispatchOption } from '../../types.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

export type TrimResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Convert certain field values to lower case.
 * @see https://hooks-common.feathersjs.com/hooks.html#trimResult
 */
export const trimResult = (fieldNames: MaybeArray<string>, options?: TrimResultOptions) => {
  const fieldNamesArray = toArray(fieldNames)

  return transformResult(
    (item: any) => {
      for (let i = 0; i < fieldNamesArray.length; i++) {
        const fieldName = fieldNamesArray[i]
        const value = _get(item, fieldName)

        if (value == null) {
          continue
        }

        if (typeof value !== 'string') {
          throw new BadRequest(`Expected string data. (lowercase ${fieldName})`)
        }

        _set(item, fieldName, value.trim())
      }
    },
    { dispatch: options?.dispatch },
  )
}
