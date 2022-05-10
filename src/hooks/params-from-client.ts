import type { Hook } from '@feathersjs/feathers';

/**
 * Pass context.params from client to server. Server hook.
 * {@link https://hooks-common.feathersjs.com/hooks.html#paramsfromclient}
 */
export function paramsFromClient (...whitelist: string[]): Hook {
  return (context: any) => {
    const params = context.params;

    if (params && params.query && params.query.$client && typeof params.query.$client === 'object') {
      const client = params.query.$client;

      whitelist.forEach(key => {
        if (key in client) {
          params[key] = client[key];
        }
      });

      params.query = Object.assign({}, params.query);
      delete params.query.$client;
    }

    return context;
  };
}
