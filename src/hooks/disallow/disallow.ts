import { MethodNotAllowed } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { TransportName } from '../../types';
import { isProvider } from '../../predicates';

/**
 * Prevents access to a service method completely or for specific transports.
 * @see https://hooks-common.feathersjs.com/hooks.html#disallow
 */
export function disallow<H extends HookContext = HookContext>(...transports: TransportName[]) {
  return (context: H) => {
    if (transports.length === 0) {
      throw new MethodNotAllowed('Method not allowed');
    }

    if (isProvider(...transports)(context)) {
      throw new MethodNotAllowed(
        `Provider '${context.params.provider}' can not call '${context.method}'. (disallow)`,
      );
    }
  };
}
