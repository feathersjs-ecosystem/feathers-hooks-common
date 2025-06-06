import { BadRequest } from '@feathersjs/errors'
import type { HookContext } from '@feathersjs/feathers'
import type { Promisable } from '../internal.utils.js'

export type ResolverProperty<T, V, C, R = V> = (
  value: V | undefined,
  obj: T,
  context: C,
  status: ResolverStatus<T, C>,
) => Promisable<R | undefined>

export type Resolver<T, C> = {
  [key in string]: ResolverProperty<
    T,
    key extends keyof T ? T[key] : undefined,
    C,
    key extends keyof T ? T[key] : any
  >
}

export type ResolverConverter<T, C> = (
  obj: any,
  context: C,
  status: ResolverStatus<T, C>,
) => Promisable<T | undefined>

export interface ResolverStatus<T, C> {
  path: string[]
  originalContext?: C
  properties?: (keyof T)[]
  stack: ResolverProperty<T, any, C>[]
}

const resolveProperty = async <T, D, K extends keyof T, C>(
  resolver: ResolverProperty<T, T[K], C>,
  name: K,
  data: D,
  context: C,
  status: Partial<ResolverStatus<T, C>> = {},
): Promise<T[K]> => {
  const value = (data as any)[name]
  const { path = [], stack = [] } = status || {}

  // This prevents circular dependencies
  if (stack.includes(resolver)) {
    return undefined as any
  }

  const resolverStatus = {
    ...status,
    path: [...path, name as string],
    stack: [...stack, resolver],
  }

  return await resolver(value, data as any, context, resolverStatus)
}

const resolve = async <T, D extends Record<string, any>, C>(
  resolver: Resolver<T, C>,
  data: D,
  context: C,
  status?: Partial<ResolverStatus<T, C>>,
): Promise<T> => {
  const propertyNames = Object.keys(resolver) as any as (keyof T)[]

  const propertyList = (
    Array.isArray(status?.properties)
      ? status?.properties
      : // By default get all data and resolver keys but remove duplicates
        [...new Set(Object.keys(data).concat(propertyNames as string[]))]
  ) as (keyof T)[]

  const result: any = {}
  const errors: any = {}
  let hasErrors = false

  // Not the most elegant but better performance
  await Promise.all(
    propertyList.map(async name => {
      const value = (data as any)[name]

      if (name in resolver) {
        const resolverProperty = resolver[name]
        try {
          const resolved = await resolveProperty(resolverProperty, name, data, context, status)

          if (resolved !== undefined) {
            result[name] = resolved
          }
        } catch (error: any) {
          // TODO add error stacks
          const convertedError =
            typeof error.toJSON === 'function'
              ? error.toJSON()
              : { message: error.message || error }

          errors[name] = convertedError
          hasErrors = true
        }
      } else if (value !== undefined) {
        result[name] = value
      }
    }),
  )

  if (hasErrors) {
    const propertyName = status?.properties ? ` ${status.properties.join('.')}` : ''

    throw new BadRequest('Error resolving data' + (propertyName ? ` ${propertyName}` : ''), errors)
  }

  return result
}

export const runResolvers = async <T, H extends HookContext>(
  resolvers: Resolver<T, H>[],
  data: any,
  ctx: H,
  status?: Partial<ResolverStatus<T, H>>,
) => {
  let current: any = data

  for (const resolver of resolvers) {
    current = await resolve(resolver, current, ctx, status)
  }

  return current as T
}

export const getResult = <H extends HookContext>(context: H) => {
  const isPaginated = context.method === 'find' && context.result.data
  const data = isPaginated ? context.result.data : context.result

  return { isPaginated, data }
}
