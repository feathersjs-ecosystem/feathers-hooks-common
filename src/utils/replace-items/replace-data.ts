import { HookContext } from '@feathersjs/feathers';
import { getDataIsArray } from '../get-data-is-array/get-data-is-array';
import { isPromise } from '../../common';
import { Promisable } from '../../internal.utils';

export function replaceData<H extends HookContext = HookContext>(
  context: H,
  cb: (item: any) => any,
): Promisable<H> {
  if (!context.data) {
    return context;
  }

  const { data, isArray } = getDataIsArray(context);

  if (!data.length) {
    return context;
  }

  let hasPromises = false;

  const results = data.map(item => {
    const result = cb(item);

    if (!hasPromises && isPromise(result)) {
      hasPromises = true;
    }

    return result;
  });

  function replace(data: any) {
    context.data = isArray ? data : data[0];

    return context;
  }

  if (hasPromises) {
    return Promise.all(results).then(replace);
  } else {
    return replace(results);
  }
}
