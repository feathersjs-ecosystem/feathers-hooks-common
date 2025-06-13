import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { ResolverObject } from './resolvers.internal.js'
import { resolve } from './resolvers.internal.js'
import { replaceData } from '../../utils/index.js'

export const resolveData =
  <T extends Record<string, any>, H extends HookContext = HookContext>(
    resolverProperties: ResolverObject<T, H>,
  ) =>
  async (context: H, next?: NextFunction) => {
    await replaceData(context, item => resolve(resolverProperties, item, context))

    if (next) {
      return next()
    }

    return context
  }
