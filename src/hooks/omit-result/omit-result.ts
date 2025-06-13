import _omit from 'lodash/omit.js'
import { transformResult } from '../transform-result/transform-result.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'
import type { DispatchOption } from '../../types.js'

export type OmitResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export const omitResult = (fieldNames: MaybeArray<string>, options?: OmitResultOptions) =>
  transformResult((item: any) => _omit(item, toArray(fieldNames)), { dispatch: options?.dispatch })
