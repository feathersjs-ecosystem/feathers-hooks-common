import { MethodNotAllowed } from '@feathersjs/errors';
import type { HookContext, NextFunction } from '@feathersjs/feathers';
import type { TransportName } from '../types';

/**
 * Prevents access to a service method completely or for specific providers.
 * @see https://hooks-common.feathersjs.com/hooks.html#disallow
 */
export const disallow = <H extends HookContext = HookContext>(...providers: TransportName[]) => {
  const disallowAll = !providers.length;
  const disallowServer = providers.some(x => x === 'server');
  const disallowExternal = providers.some(x => x === 'external');

  return (context: H, next?: NextFunction) => {
    const provider = context.params?.provider;

    if (
      disallowAll ||
      (disallowServer && !provider) ||
      (disallowExternal && !!provider) ||
      providers.includes(provider)
    ) {
      throw new MethodNotAllowed(
        `Provider '${context.params.provider}' can not call '${context.method}'. (disallow)`
      );
    }

    if (next) {
      return next();
    }

    return context;
  };
};
