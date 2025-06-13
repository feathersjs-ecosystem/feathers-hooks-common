import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { traverse as _traverse } from '../../common/index.js'
import type { SyncContextFunction } from '../../types.js'
import { getItems } from '../../utils/index.js'

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * @see https://hooks-common.feathersjs.com/hooks.html#traverse
 */
export function traverse<H extends HookContext = HookContext>(
  transformer: (transformContext: any) => any,
  getObject?: SyncContextFunction<any, H>,
) {
  return (context: H, next?: NextFunction) => {
    const items =
      typeof getObject === 'function' ? getObject(context) : getObject || getItems(context)

    _traverse(items, transformer)

    if (next) {
      return next()
    }

    return context
  }
}
