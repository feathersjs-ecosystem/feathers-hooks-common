import type { HookContext, NextFunction } from '@feathersjs/feathers'
import type { PredicateFn } from '../../types.js'
import { BadRequest } from '@feathersjs/errors'
import type { FeathersError } from '@feathersjs/errors'

export type ThrowIfOptions = {
  error?: (context: HookContext) => FeathersError
}

export const throwIf = <H extends HookContext = HookContext>(
  predicate: PredicateFn,
  options?: ThrowIfOptions,
) => {
  return async (context: H, next?: NextFunction) => {
    const result = await predicate(context)

    if (result) {
      throw options?.error ? options.error(context) : new BadRequest('Invalid operation')
    }

    if (next) {
      await next()
    }

    return context
  }
}
