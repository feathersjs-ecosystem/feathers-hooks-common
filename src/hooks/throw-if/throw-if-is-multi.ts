import type { HookContext } from '@feathersjs/feathers'
import type { PredicateFn } from '../../types.js'
import { type FeathersError } from '@feathersjs/errors'
import { every, isMulti } from '../../predicates/index.js'
import { throwIf } from './throw-if.js'

export type ThrowIfIsMultiOptions = {
  filter?: PredicateFn
  error?: (context: HookContext) => FeathersError
}

export const throwIfIsMulti = <H extends HookContext = HookContext>(
  options?: ThrowIfIsMultiOptions,
) =>
  throwIf<H>(
    every(
      every(isMulti, context => context.method !== 'find'),
      options?.filter,
    ),
    {
      error: options?.error,
    },
  )
