import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { SyncContextFunction } from '../../types';
import { replaceResult } from '../../utils/replace-items/replace-result';

export function sifter<H extends HookContext = HookContext>(
  siftFunc: SyncContextFunction<(item: any) => boolean, H>,
) {
  return (context: H) => {
    const sifter = siftFunc(context);

    if (typeof sifter !== 'function') {
      throw new BadRequest('The result of calling the sifter param must be a function. (sifter)');
    }

    return replaceResult(context, item => item, {
      transform: items => items.filter(sifter),
    });
  };
}
