import type { HookType } from '@feathersjs/feathers'
import type { MethodName } from '../../types.js'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'

export type IsContextOptions = {
  path?: MaybeArray<string>
  type?: MaybeArray<HookType>
  method?: MaybeArray<MethodName>
}

export const isContext =
  (options: IsContextOptions) =>
  (context: any): boolean => {
    if (options.path != null) {
      const path = toArray(options.path)

      if (!path.some(x => context.path.includes(x))) {
        return false
      }
    }

    if (options.type != null) {
      const type = toArray(options.type)

      if (!type.some(x => context.type === x)) {
        return false
      }
    }

    if (options.method != null) {
      const method = toArray(options.method)

      if (!method.some(x => context.method === x)) {
        return false
      }
    }

    return true
  }
