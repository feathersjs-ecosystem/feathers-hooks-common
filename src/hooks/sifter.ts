import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import type { SyncContextFunction } from '../types';
import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

export function sifter<H extends HookContext = HookContext>(
  siftFunc: SyncContextFunction<(item: any) => boolean, H>,
) {
  return (context: H) => {
    checkContext(context, 'after', 'find', 'sifter');

    if (typeof siftFunc !== 'function') {
      throw new BadRequest('The sifter param must be a function. (sifter)');
    }

    const sifter = siftFunc(context);

    if (typeof sifter !== 'function') {
      throw new BadRequest('The result of calling the sifter param must be a function. (sifter)');
    }

    replaceItems(context, getItems(context).filter(sifter));

    return context;
  };
}
