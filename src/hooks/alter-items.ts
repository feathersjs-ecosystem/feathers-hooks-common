import { BadRequest } from '@feathersjs/errors';

import type { HookContext } from '@feathersjs/feathers';
import { isPromise } from '../common';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

/**
 * Make changes to data or result items. Very flexible.
 * @see https://hooks-common.feathersjs.com/hooks.html#alteritems
 */
export function alterItems<T = any, H extends HookContext = HookContext>(
  cb: (record: T, context: H) => any,
) {
  if (!cb) {
    cb = () => {};
  }

  if (typeof cb !== 'function') {
    throw new BadRequest('Function required. (alter)');
  }

  return (context: H) => {
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
      return Promise.all(results).then(values => {
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
