import { BadRequest } from '@feathersjs/errors';
import type { Application, Hook, Service } from '@feathersjs/feathers';
import type { SyncContextFunction } from '../types';
import { checkContext } from '../utils/check-context';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

export function sifter<A extends Application = Application, S extends Service = Service>(
  siftFunc: SyncContextFunction<(item: any) => boolean>
): Hook<A, S> {
  return context => {
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
