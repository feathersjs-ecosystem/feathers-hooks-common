import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { isPromise } from '../../common/index.js'
import { replaceResult } from '../../utils/replace-items/replace-result.js'
import type { DispatchOption } from '../../types.js'

export type TransformResultOptions = {
  dispatch?: DispatchOption
}

/**
 * Make changes to result items. Very flexible.
 * @see https://hooks-common.feathersjs.com/hooks.html#alteritems
 */
export const transformResult =
  <T = any, H extends HookContext = HookContext>(
    cb: (record: T, context: H) => any,
    options?: TransformResultOptions,
  ) =>
  (context: H, next?: NextFunction) =>
    replaceResult(
      context,
      (item: any) => {
        const result = cb(item, context)

        if (isPromise(result)) {
          return result.then((res: any) => res ?? item)
        } else {
          return result ?? item
        }
      },
      {
        next,
        dispatch: options?.dispatch,
      },
    )
