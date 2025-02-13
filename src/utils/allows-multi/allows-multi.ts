import { HookContext } from '@feathersjs/feathers';
import { isMulti } from '../is-multi/is-multi';

export const allowsMulti = <H extends HookContext = HookContext>(context: H): boolean => {
  const { service, method } = context;
  if (!service.allowsMulti || !isMulti(context) || method === 'find') {
    return true;
  }

  return service.allowsMulti(method);
};
