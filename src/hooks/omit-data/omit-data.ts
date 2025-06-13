import _omit from 'lodash/omit.js'
import { transformData } from '../transform-data/transform-data.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitData = (fieldNames: MaybeArray<string>) =>
  transformData((item: any) => _omit(item, toArray(fieldNames)))
