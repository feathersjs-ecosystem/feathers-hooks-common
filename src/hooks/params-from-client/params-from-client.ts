import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { MaybeArray } from '../../internal.utils.js'
import { toArray } from '../../internal.utils.js'
import { FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } from '../params-for-server/params-for-from-shared.js'

export type paramsFromClientOptions = {
  /**
   * @default '_$client'
   */
  keyToHide?: string
}

export const paramsFromClient = (
  whitelist: MaybeArray<string>,
  options?: paramsFromClientOptions,
) => {
  const whitelistArr = toArray(whitelist)
  const { keyToHide = FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } = options || {}
  return (context: HookContext, next?: NextFunction) => {
    if (
      !context.params?.query?.[keyToHide] ||
      typeof context.params.query[keyToHide] !== 'object'
    ) {
      return context
    }

    const params = {
      ...context.params,
      query: {
        ...context.params.query,
        [keyToHide]: {
          ...context.params.query[keyToHide],
        },
      },
    }

    const client = params.query[keyToHide]

    whitelistArr.forEach(key => {
      if (key in client) {
        params[key] = client[key]
        delete client[key]
      }
    })

    if (Object.keys(client).length === 0) {
      delete params.query[keyToHide]
    }

    context.params = params

    if (next) {
      return next()
    }

    return context
  }
}
