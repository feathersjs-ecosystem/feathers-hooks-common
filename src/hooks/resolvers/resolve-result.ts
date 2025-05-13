import { HookContext, NextFunction } from '@feathersjs/feathers';
import { getResult, Resolver, runResolvers } from './resolvers.internal';

export const resolveResult = <H extends HookContext>(...resolvers: Resolver<any, H>[]) => {
  return async (context: H, next: NextFunction) => {
    if (typeof next !== 'function') {
      throw new Error('The resolveResult hook must be used as an around hook');
    }

    const { $resolve, $select, ...query } = context.params?.query || {};

    const resolve = {
      originalContext: context,
      ...context.params.resolve,
      properties: $resolve || $select,
    };

    context.params = {
      ...context.params,
      resolve,
      query: {
        ...query,
      },
    };

    await next();

    const status = context.params.resolve;
    const { isPaginated, data } = getResult(context);

    const result = Array.isArray(data)
      ? await Promise.all(
          data.map(async current => runResolvers(resolvers, current, context, status)),
        )
      : await runResolvers(resolvers, data, context, status);

    if (isPaginated) {
      context.result.data = result;
    } else {
      context.result = result;
    }
  };
};
