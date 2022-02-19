import { MethodNotAllowed } from '@feathersjs/errors';
import { Hook } from '@feathersjs/feathers';
import { TransportName } from '../types';

/**
 * Prevents access to a service method completely or for specific transports.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Disallow}
 */
export function disallow (...transports: TransportName[]): Hook {
  return (context: any) => {
    const hookProvider = (context.params || {}).provider;

    const anyProvider = transports.length === 0;
    const thisProvider = transports.some(provider =>
      provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );

    if (anyProvider || thisProvider) {
      throw new MethodNotAllowed(
        `Provider '${context.params.provider}' can not call '${context.method}'. (disallow)`
      );
    }
  };
}
