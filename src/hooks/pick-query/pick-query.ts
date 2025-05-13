import type { HookContext, NextFunction } from '@feathersjs/feathers';
import _pick from 'lodash/pick';
import { MaybeArray, toArray } from '../../internal.utils';

/**
 * Keep certain fields in the query object, deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepquery
 */
export const pickQuery = <H extends HookContext = HookContext>(fieldNames: MaybeArray<string>) => {
  const fieldNamesArr = toArray(fieldNames);
  return (context: H, next?: NextFunction) => {
    if (!context.params.query) {
      return context;
    }

    context.params.query = _pick(context.params.query, fieldNamesArr);

    if (next) return next().then(() => context);

    return context;
  };
};
