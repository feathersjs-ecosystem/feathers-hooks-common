import { HookContext, NextFunction } from '@feathersjs/feathers';
import { getResultIsArray } from '../get-result-is-array/get-result-is-array';
import { isPromise } from '../../common';
import copy from 'fast-copy';
import { DispatchOption } from '../../types';

export type ReplaceResultOptions = {
  next?: NextFunction;
  transform?: (items: any[]) => any[];
  dispatch?: DispatchOption;
};

export async function replaceResult<H extends HookContext = HookContext>(
  context: H,
  cb: (item: any) => any,
  options?: ReplaceResultOptions,
): Promise<H> {
  if (options?.next) {
    await options.next();
  }

  if (!!options?.dispatch && !context.dispatch) {
    context.dispatch = copy(context.result);
  }

  async function forResult(dispatch: boolean) {
    const { result, isArray, key } = getResultIsArray(context, { dispatch });

    if (!result.length) {
      return context;
    }

    let hasPromises = false;

    const results = result.map(item => {
      const result = cb(item);

      if (!hasPromises && isPromise(result)) {
        hasPromises = true;
      }

      return result;
    });

    function replace(r: any) {
      if (options?.transform) {
        r = options.transform(r);
      }

      if (!isArray) {
        context[key] = r[0];
      } else if (isArray && !Array.isArray(context[key]) && context[key].data) {
        context[key].data = r;
      } else {
        context[key] = r;
      }

      return context;
    }

    if (hasPromises) {
      return await Promise.all(results).then(replace);
    } else {
      return replace(results);
    }
  }

  if (options?.dispatch === 'both') {
    await Promise.all([forResult(true), forResult(false)]);
    return context;
  }

  return await forResult(options?.dispatch ?? false);
}
