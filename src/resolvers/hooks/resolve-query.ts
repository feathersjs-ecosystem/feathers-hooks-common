import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { type ResolverObject, resolve } from './resolvers.internal.js'

export const resolveQuery =
  <H extends HookContext>(resolverProperties: ResolverObject<any, H>) =>
  async (context: H, next?: NextFunction) => {
    const queryIngoing = context?.params?.query || {}
    const query = await resolve(resolverProperties, queryIngoing, context)

    context.params = {
      ...context.params,
      query,
    }

    if (next) {
      return next()
    }

    return context
  }
