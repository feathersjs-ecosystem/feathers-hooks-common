import type { HookContext, NextFunction } from '@feathersjs/feathers'
import { type Resolver, runResolvers } from './resolvers.internal.js'

export const resolveQuery =
  <H extends HookContext>(...resolvers: Resolver<any, H>[]) =>
  async (context: H, next?: NextFunction) => {
    const data = context?.params?.query || {}
    const query = await runResolvers(resolvers, data, context)

    context.params = {
      ...context.params,
      query,
    }

    if (typeof next === 'function') {
      return next()
    }
  }
