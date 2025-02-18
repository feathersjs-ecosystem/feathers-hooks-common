import type { HookContext } from '@feathersjs/feathers';

/**
 * Pass context.params from client to server. Server hook.
 * @see https://hooks-common.feathersjs.com/hooks.html#paramsfromclient
 *
 * @deprecated use `paramsFromClient2` instead
 */
export function paramsFromClient<H extends HookContext = HookContext>(...whitelist: string[]) {
  return (context: H) => {
    const params = context.params;

    if (params?.query?.$client && typeof params.query.$client === 'object') {
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
