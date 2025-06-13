import _pick from 'lodash/pick.js'

import { transformResult } from '../transform-result/transform-result.js'
import type { DispatchOption } from '../../types.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

export type PickResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickResult = (fieldNames: MaybeArray<string>, options?: PickResultOptions) => {
  const fieldNamesArr = toArray(fieldNames)
  return transformResult(
    (item: any) => {
      if (typeof item !== 'object' || item === null) return item

      return _pick(item, fieldNamesArr)
    },
    { dispatch: options?.dispatch },
  )
}
