import { MethodNotAllowed } from '@feathersjs/errors';
import { SyncContextFunction, TransportName } from '../types';

/**
 * Check which transport provided the service call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#IsProvider}
 */
export function isProvider (
  ...providers: TransportName[]
): SyncContextFunction<boolean> {
  if (!providers.length) {
    throw new MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return (context: any) => {
    const hookProvider = (context.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );
  };
}
