import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { isPromise } from '../../common';
import { replaceResult } from '../../utils/replace-items/replace-result';
import { DispatchOption } from '../../types';

export type AlterResultOptions = {
  dispatch?: DispatchOption;
};

/**
 * Make changes to result items. Very flexible.
 * @see https://hooks-common.feathersjs.com/hooks.html#alteritems
 */
export const alterResult =
  <T = any, H extends HookContext = HookContext>(
    cb: (record: T, context: H) => any,
    options?: AlterResultOptions,
  ) =>
  (context: H, next?: NextFunction) =>
    replaceResult(
      context,
      (item: any) => {
        const result = cb(item, context);

        if (isPromise(result)) {
          return result.then((res: any) => res ?? item);
        } else {
          return result ?? item;
        }
      },
      {
        next,
        dispatch: options?.dispatch,
      },
    );
