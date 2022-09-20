import { BadRequest } from '@feathersjs/errors';

import type { Application, HookContext, Service } from '@feathersjs/feathers';
import { isPromise } from '../common';
import type { HookFunction } from '../types';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

/**
 * Make changes to data or result items. Very flexible.
 * {@link https://hooks-common.feathersjs.com/hooks.html#alteritems}
 */
export function alterItems <T = any, A extends Application = Application, S extends Service = Service> (
  cb: (record: T, context: HookContext<A, S>) => any
): HookFunction<A, S> {
  if (!cb) {
    cb = () => {};
  }

  if (typeof cb !== 'function') {
    throw new BadRequest('Function required. (alter)');
  }

  return (context: any) => {
    let items = getItems(context);
    const isArray = Array.isArray(items);

    const results: any[] = (isArray ? items : [items]).map((item: any) => cb(item, context));

    const hasPromises = results.some((result: any) => isPromise(result));

    const setItem = (value: any, index: any) => {
      if (typeof value === 'object' && value !== null) {
        if (isArray) {
          items[index] = value;
        } else {
          items = value;
        }
      }
    };

    if (hasPromises) {
      return Promise.all(results)
        .then(values => {
          values.forEach(setItem);

          replaceItems(context, items);
          return context;
        });
    } else {
      results.forEach(setItem);

      replaceItems(context, items);
      return context;
    }
  };
}
