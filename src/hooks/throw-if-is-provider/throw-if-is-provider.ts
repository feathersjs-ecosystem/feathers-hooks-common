import type { HookContext } from '@feathersjs/feathers'
import type { PredicateFn, TransportName } from '../../types.js'
import type { ThrowIfOptions } from './throw-if.js'
import { throwIf } from './throw-if.js'
import { toArray } from 'lodash'
import { every, isProvider } from '../../predicates/index.js'
import { MethodNotAllowed } from '@feathersjs/errors'

const defaultError = (context: HookContext) =>
  new MethodNotAllowed(`Provider '${context.params.provider}' can not call '${context.method}'.`)

export type ThrowIfIsIsProviderOptions = ThrowIfOptions & {
  filter?: PredicateFn
}

export const throwIfIsProvider = <H extends HookContext = HookContext>(
  transports: TransportName | TransportName[],
  options?: ThrowIfIsIsProviderOptions,
) => {
  const disallowTransports = toArray(transports)

  return throwIf<H>(every(isProvider(...(disallowTransports as any)), options?.filter), {
    error: options?.error ?? defaultError,
  })
}
