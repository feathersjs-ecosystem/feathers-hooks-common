import { HookContext, NextFunction } from '@feathersjs/feathers';
import { getResultIsArray } from '../get-result-is-array/get-result-is-array';
import { isPromise } from '../../common';

export async function replaceResult<H extends HookContext = HookContext>(
  context: H,
  cb: (item: any) => any,
  options?: {
    next?: NextFunction;
    transform?: (items: any[]) => any[];
  },
): Promise<H> {
  if (options?.next) {
    await options.next();
  }

  if (!context.result) {
    return context;
  }

  const { result, isArray, key } = getResultIsArray(context);

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
