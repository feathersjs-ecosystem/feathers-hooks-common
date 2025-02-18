import { HookContext } from '@feathersjs/feathers';
import { TransportName } from '../../types';
import { throwIf, ThrowIfOptions } from './throw-if';
import { toArray } from 'lodash';
import { isProvider } from '../../predicates';
import { MethodNotAllowed } from '@feathersjs/errors';

const defaultError = (context: HookContext) =>
  new MethodNotAllowed(`Provider '${context.params.provider}' can not call '${context.method}'.`);

export const throwIfIsProvider = <H extends HookContext = HookContext>(
  transports: TransportName | TransportName[],
  options?: ThrowIfOptions,
) => {
  const disallowTransports = toArray(transports);

  return throwIf<H>(isProvider(...(disallowTransports as any)), {
    error: options?.error ?? defaultError,
  });
};
