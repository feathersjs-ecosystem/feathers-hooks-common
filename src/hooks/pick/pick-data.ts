import _pick from 'lodash/pick.js'
import { transformData } from '../transform/transform-data.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export const pickData = (fieldNames: MaybeArray<string>) => {
  const fieldNamesArr = toArray(fieldNames)
  return transformData((item: any) => {
    if (typeof item !== 'object' || item === null) return item

    return _pick(item, fieldNamesArr)
  })
}
