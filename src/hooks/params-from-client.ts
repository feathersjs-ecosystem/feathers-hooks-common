import type { Application, Hook, Service } from '@feathersjs/feathers';

/**
 * Pass context.params from client to server. Server hook.
 * @see https://hooks-common.feathersjs.com/hooks.html#paramsfromclient
 */
export function paramsFromClient<A extends Application = Application, S extends Service = Service>(
  ...whitelist: string[]
): Hook<A, S> {
  return context => {
    const params = context.params;

    if (params?.query?.$client && typeof params.query.$client === 'object') {
      const client = params.query.$client;

      whitelist.forEach(key => {
        if (key in client) {
          // @ts-ignore
          params[key] = client[key];
        }
      });

      params.query = Object.assign({}, params.query);
      delete params.query.$client;
    }

    return context;
  };
}
