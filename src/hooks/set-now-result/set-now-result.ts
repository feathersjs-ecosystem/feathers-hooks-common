import _set from 'lodash/set.js'
import { transformResult } from '../transform-result/transform-result.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'
import type { DispatchOption } from '../../types.js'

type SetNowResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export const setNowResult = (fieldNames: MaybeArray<string>, options?: SetNowResultOptions) => {
  const fieldNamesArray = toArray(fieldNames)

  return transformResult(
    data => {
      for (let i = 0, n = fieldNamesArray.length; i < n; i++) {
        const key = fieldNamesArray[i]

        _set(data, key, new Date())
      }
    },
    { dispatch: options?.dispatch },
  )
}
