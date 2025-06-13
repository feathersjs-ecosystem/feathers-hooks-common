import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { replaceData } from '../../utils/replace-items/replace-data.js'
import { isPromise } from '../../common/index.js'

/**
 * Make changes to data items. Very flexible.
 * @see https://hooks-common.feathersjs.com/hooks.html#alteritems
 */
export const transformData =
  <T = any, H extends HookContext = HookContext>(cb: (record: T, context: H) => any) =>
  async (context: H, next?: NextFunction) => {
    await replaceData(context, (item: any) => {
      const result = cb(item, context)

      if (isPromise(result)) {
        return result.then((res: any) => res ?? item)
      } else {
        return result ?? item
      }
    })

    if (next) {
      return next()
    }

    return context
  }
