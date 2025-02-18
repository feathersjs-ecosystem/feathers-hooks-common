import { HookContext } from '@feathersjs/feathers';
import { PredicateFn } from '../../types';
import { BadRequest } from '@feathersjs/errors';
import type { FeathersError } from '@feathersjs/errors';

export type ThrowIfOptions = {
  error?: (context: HookContext) => FeathersError;
};

export const throwIf = <H extends HookContext = HookContext>(
  predicate: PredicateFn,
  options?: ThrowIfOptions,
) => {
  return async (context: H) => {
    const result = await predicate(context);

    if (result) {
      throw options?.error ? options.error(context) : new BadRequest('Invalid operation');
    }
  };
};
