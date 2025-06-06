import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { checkContext } from '../../utils/index.js'
import type { TransformParamsFn } from '../../types.js'
import { transformParams } from '../../utils/transform-params/transform-params.js'
import type { Promisable } from '../../internal.utils.js'

export type SoftDeleteOptionFunction<H extends HookContext = HookContext> = (
  context?: H,
) => Promisable<{ [key: string]: any }>

export interface SoftDeleteOptions<H extends HookContext = HookContext> {
  /**
   * @default { deletedAt: { $ne: true } }
   */
  deletedQuery?: { [key: string]: any } | SoftDeleteOptionFunction<H>
  /**
   * @default { deletedAt: new Date() }
   */
  removeData?: { [key: string]: any } | SoftDeleteOptionFunction<H>
  /**
   * Transform the params before calling the service method. E.g. remove 'params.provider' or add custom params.
   */
  transformParams?: TransformParamsFn

  /**
   * @default 'disableSoftDelete'
   */
  disableSoftDeleteKey?: string
}

const defaultQuery = () => ({ deletedAt: { $ne: true } })
const defaultData = () => ({ deletedAt: new Date() })

/**
 * Allow to mark items as deleted instead of removing them.
 */
export const softDelete =
  <H extends HookContext = HookContext>(options: SoftDeleteOptions<H> = {}) =>
  async (context: H, next?: NextFunction) => {
    checkContext(context, ['before', 'around'], null, 'softDelete')

    const { disableSoftDeleteKey = 'disableSoftDelete' } = options

    if (context.params[disableSoftDeleteKey]) {
      return context
    }

    const { deletedQuery = defaultQuery, removeData = defaultData } = options

    const deleteQuery = await getValue(deletedQuery, context)

    const params = transformParams(
      {
        ...context.params,
        query: {
          ...context.params.query,
          ...deleteQuery,
        },
      },
      options.transformParams,
    )

    context.params = params

    if (context.method === 'remove') {
      const data = await getValue(removeData, context)
      const result = await context.service.patch(context.id, data, params)

      context.result = result
    }

    if (next) {
      await next()
    }

    return context
  }

const getValue = (value: any, ...args: any[]) => {
  if (typeof value === 'function') {
    return value(...args)
  }
  return value
}
