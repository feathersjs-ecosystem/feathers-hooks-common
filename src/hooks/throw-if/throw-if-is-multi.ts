import { HookContext, NextFunction } from '@feathersjs/feathers';
import { checkContext } from '../../utils';
import { PredicateFn } from '../../types';
import { BadRequest, type FeathersError } from '@feathersjs/errors';
import { isMulti } from '../../predicates';

export type ThrowIfIsMultiOptions = {
  filter?: PredicateFn;
  error?: (context: HookContext) => FeathersError;
};

export const throwIfIsMulti = <H extends HookContext = HookContext>(
  options?: ThrowIfIsMultiOptions,
) => {
  return async (context: H, next?: NextFunction) => {
    checkContext(context, ['before', 'around'], ['create', 'patch', 'remove'], 'throwIfIsMulti');

    if (!isMulti(context)) {
      return context;
    }

    if (!options?.filter || (await options.filter(context))) {
      throw options?.error ? options.error(context) : new BadRequest('Invalid operation');
    }

    if (next) {
      await next();
    }

    return context;
  };
};
