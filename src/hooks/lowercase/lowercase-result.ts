import _get from 'lodash/get.js'
import _set from 'lodash/set.js'
import { BadRequest } from '@feathersjs/errors'
import { transformResult } from '../transform/transform-result.js'
import type { DispatchOption } from '../../types.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

export type LowercaseResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Convert certain field values to lower case.
 * @see https://hooks-common.feathersjs.com/hooks.html#lowercase
 */
export const lowercaseResult = (
  fieldNames: MaybeArray<string>,
  options?: LowercaseResultOptions,
) => {
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

        _set(item, fieldName, value.toLowerCase())
      }
    },
    { dispatch: options?.dispatch },
  )
}
