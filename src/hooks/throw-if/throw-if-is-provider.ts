import type { HookContext } from '@feathersjs/feathers'
import type { TransportName } from '../../types.js'
import type { ThrowIfOptions } from './throw-if.js'
import { throwIf } from './throw-if.js'
import { toArray } from 'lodash'
import { isProvider } from '../../predicates/index.js'
import { MethodNotAllowed } from '@feathersjs/errors'

const defaultError = (context: HookContext) =>
  new MethodNotAllowed(`Provider '${context.params.provider}' can not call '${context.method}'.`)

export const throwIfIsProvider = <H extends HookContext = HookContext>(
  transports: TransportName | TransportName[],
  options?: ThrowIfOptions,
) => {
  const disallowTransports = toArray(transports)

  return throwIf<H>(isProvider(...(disallowTransports as any)), {
    error: options?.error ?? defaultError,
  })
}
