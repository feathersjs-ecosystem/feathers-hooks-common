import type { HookContext } from '@feathersjs/feathers';
import { isMulti } from '../is-multi/is-multi';
import { isPaginated } from '../is-paginated/is-paginated';

/**
 * util to set `context.result` to an empty array or object, depending on the hook type
 */
export const skipResult = <H extends HookContext = HookContext>(context: H) => {
  if (context.result) {
    return context;
  }

  const multi = isMulti(context);

  if (multi) {
    if (context.method === 'find' && isPaginated(context)) {
      context.result = {
        total: 0,
        skip: 0,
        limit: 0,
        data: [],
      };
    } else {
      context.result = [];
    }
  } else {
    context.result = null;
  }

  return context;
};
