import _get from 'lodash/get.js'
import _setWith from 'lodash/setWith.js'
import _clone from 'lodash/clone.js'
import { checkContext } from '../../utils/index.js'
import { Forbidden } from '@feathersjs/errors'
import type { HookContext, NextFunction } from '@feathersjs/feathers'

export interface SetFieldOptions {
  as: string
  from: string
  allowUndefined?: boolean
}

/**
 * The `setField` hook allows to set a field on the hook context based on the value of another field on the hook context.
 * @see https://hooks-common.feathersjs.com/hooks.html#setfield
 */
export const setField =
  <H extends HookContext = HookContext>({ as, from, allowUndefined = false }: SetFieldOptions) =>
  (context: H, next?: NextFunction) => {
    const { params } = context

    checkContext(context, ['before', 'around'], null, 'setField')

    const value = _get(context, from)

    if (value === undefined) {
      if (!params.provider || allowUndefined) {
        return context
      }

      throw new Forbidden(`Expected field ${as} not available`)
    }

    context = _setWith(context, as, value, _clone)

    if (next) return next().then(() => context)

    return context
  }
