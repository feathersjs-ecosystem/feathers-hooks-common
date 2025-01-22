import type { Params } from '@feathersjs/feathers';

/**
 * Pass an explicit context.params from client to server. Client-side. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#paramsforserver
 */
export function paramsForServer(params?: Params, ...whitelist: string[]): Params {
  const ifWhitelist = !!whitelist.length;
  const _params: Record<string, any> = Object.assign({}, params);

  _params.query = _params.query || {};
  _params.query.$client = _params.query.$client || {};

  Object.keys(_params).forEach(key => {
    if (key !== 'query') {
      if (!ifWhitelist || whitelist.includes(key)) {
        _params.query.$client[key] = _params[key];
      }

      delete _params[key];
    }
  });

  return _params;
}
