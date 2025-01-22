import type { HookContext } from '@feathersjs/feathers';
import { replaceData } from '../../utils/replace-items/replace-data';
import { isPromise } from 'util/types';

/**
 * Make changes to data items. Very flexible.
 * @see https://hooks-common.feathersjs.com/hooks.html#alteritems
 */
export const alterData =
  <T = any, H extends HookContext = HookContext>(cb: (record: T, context: H) => any) =>
  (context: H) =>
    replaceData(context, (item: any) => {
      const result = cb(item, context);

      if (isPromise(result)) {
        return result.then((res: any) => res ?? item);
      } else {
        return result ?? item;
      }
    });
