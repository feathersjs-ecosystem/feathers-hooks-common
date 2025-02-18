import type { HookContext } from '@feathersjs/feathers';
import { MaybeArray, toArray } from '../../internal.utils';

export const FROM_CLIENT_FOR_SERVER_DEFAULT_KEY = '_$client' as const;

export type ParamsForServer2Options = {
  /**
   * @default '_$client'
   */
  keyToHide?: string;
};

/**
 * a hook to move params to query._$client
 * the server only receives 'query' from params. All other params are ignored.
 * So, to use `$populateParams` on the server, we need to move the params to query._$client
 * the server will move them back to params
 */
export const paramsForServer2 = (
  whitelist: MaybeArray<string>,
  options?: ParamsForServer2Options,
) => {
  const whitelistArr = toArray(whitelist);

  const { keyToHide = FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } = options || {};

  return <H extends HookContext>(context: H) => {
    // clone params on demand
    let clonedParams: any;

    Object.keys(context.params).forEach(key => {
      if (key === 'query') {
        return;
      }

      if (whitelistArr.includes(key)) {
        if (!clonedParams) {
          clonedParams = {
            ...context.params,
            query: {
              ...context.params.query,
            },
          };
        }

        if (!clonedParams.query[keyToHide]) {
          clonedParams.query[keyToHide] = {};
        }

        clonedParams.query[keyToHide][key] = clonedParams[key];
        delete clonedParams[key];
      }
    });

    if (clonedParams) {
      context.params = clonedParams;
    }

    return context;
  };
};
