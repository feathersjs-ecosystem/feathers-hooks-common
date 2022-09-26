import { MethodNotAllowed } from '@feathersjs/errors';
import type { Application, Service } from '@feathersjs/feathers';
import type { SyncContextFunction, TransportName } from '../types';

/**
 * Check which transport provided the service call.
 * @see https://hooks-common.feathersjs.com/utilities.html#isprovider
 */
export function isProvider<A extends Application = Application, S extends Service = Service>(
  ...providers: TransportName[]
): SyncContextFunction<boolean, A, S> {
  if (!providers.length) {
    throw new MethodNotAllowed('Calling isProvider predicate incorrectly.');
  }

  return context => {
    const hookProvider = context.params.provider;

    return providers.some(
      provider =>
        provider === hookProvider ||
        (provider === 'server' && !hookProvider) ||
        (provider === 'external' && !!hookProvider)
    );
  };
}
