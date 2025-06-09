import { BadRequest } from '@feathersjs/errors'
import type { Promisable } from '../../internal.utils.js'

export type ResolverProperty<T, V, C, R = V> = (
  value: V | undefined,
  obj: T,
  context: C,
  status: ResolverOptions<T, C>,
) => Promisable<R | undefined>

export type ResolverObject<T, C> = {
  [key in string]: ResolverProperty<
    T,
    key extends keyof T ? T[key] : undefined,
    C,
    key extends keyof T ? T[key] : any
  >
}

export interface ResolverOptions<T, C> {
  path: string[]
  stack: ResolverProperty<T, any, C>[]
  select?: string[]
}

const resolveProperty = async <T, D, K extends keyof T, C>(
  resolver: ResolverProperty<T, T[K], C>,
  name: K,
  data: D,
  context: C,
  status: Partial<ResolverOptions<T, C>> = {},
): Promise<T[K] | undefined> => {
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

export const resolve = async <T, D extends Record<string, any>, C>(
  resolverProperties: ResolverObject<T, C>,
  data: D,
  context: C,
  options?: Partial<ResolverOptions<T, C>>,
): Promise<T> => {
  let propertyNames = Object.keys(resolverProperties) as any as (keyof T)[]

  if (options?.select) {
    // If select is defined, filter the properties to only those that are selected
    propertyNames = propertyNames.filter(name => options.select!.includes(name as string))
  }

  if (!propertyNames.length) {
    // If no properties are defined, return the data as is
    return data as any as T
  }

  const propertyList = [...new Set(Object.keys(data).concat(propertyNames as string[]))]

  const result: any = {}
  const errors: any = {}
  let hasErrors = false

  // Not the most elegant but better performance
  await Promise.all(
    propertyList.map(async name => {
      const value = (data as any)[name]

      if (name in resolverProperties) {
        const resolverProperty = resolverProperties[name]
        try {
          const resolved = await resolveProperty(
            resolverProperty as any,
            name as any,
            data,
            context,
            options,
          )

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
    throw new BadRequest('Error resolving data', errors)
  }

  return result
}
