import { HookContext } from '@feathersjs/feathers';
import { getPaginate } from '../../utils/get-paginate/get-paginate';

/**
 * util to check if a hook is a paginated hook using `getPaginate`
 */
export const isPaginated = <H extends HookContext = HookContext>(context: H): boolean => {
  if (context.params.paginate === false || context.method !== 'find') {
    return false;
  }

  const paginate = getPaginate(context);

  return !!paginate;
};
