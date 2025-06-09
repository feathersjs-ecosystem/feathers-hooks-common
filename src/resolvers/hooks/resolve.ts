import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { ResolverObject } from './resolvers.internal.js'
import { resolveData } from './resolve-data.js'
import { resolveQuery } from './resolve-query.js'

export const resolve = <
  T extends Record<string, any>,
  H extends HookContext = HookContext,
>(resolverProperties: {
  data?: ResolverObject<T, H>
  query?: ResolverObject<T, H>
  result?: ResolverObject<T, H>
}) => {
  const dataResolver = resolverProperties.data ? resolveData(resolverProperties.data) : undefined
  const queryResolver = resolverProperties.query
    ? resolveQuery(resolverProperties.query)
    : undefined
  const resultResolver = resolverProperties.result
    ? resolveData(resolverProperties.result)
    : undefined

  if (!dataResolver && !queryResolver && !resultResolver) {
    throw new Error('At least one resolver must be provided (data, query, or result)')
  }

  return async (context: H, next?: NextFunction) => {
    if (queryResolver || dataResolver) {
      const promisesBefore: Promise<any>[] = []

      if (queryResolver) {
        promisesBefore.push(queryResolver(context, next))
      }

      if (dataResolver) {
        promisesBefore.push(dataResolver(context, next))
      }

      await Promise.all(promisesBefore)
    }

    if (typeof next === 'function') {
      await next()
    }

    if (resultResolver) {
      await resultResolver(context, next)
    }

    return context
  }
}
