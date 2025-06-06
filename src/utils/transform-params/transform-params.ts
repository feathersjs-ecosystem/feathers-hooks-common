import type { Params } from '@feathersjs/feathers'
import type { TransformParamsFn } from '../../types.js'

/**
 * Safely use a transformParams function to modify params.
 */
export const transformParams = <P extends Params = Params>(
  params: P,
  fn: TransformParamsFn<P> | undefined,
): P => {
  if (!fn) {
    return params
  }

  const result = fn({ ...params })

  return result ?? params
}
