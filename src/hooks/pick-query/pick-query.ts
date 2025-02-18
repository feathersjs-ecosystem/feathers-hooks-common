import type { HookContext } from '@feathersjs/feathers';
import _pick from 'lodash/pick';

/**
 * Keep certain fields in the query object, deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepquery
 */
export const pickQuery = <H extends HookContext = HookContext>(...fieldNames: string[]) => {
  return (context: H) => {
    if (!context.params.query) {
      return context;
    }

    context.params.query = _pick(context.params.query, fieldNames);

    return context;
  };
};

// alias
export { pickQuery as keepQuery };
