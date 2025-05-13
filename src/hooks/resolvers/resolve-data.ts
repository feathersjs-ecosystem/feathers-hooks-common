import { HookContext, NextFunction } from '@feathersjs/feathers';
import { Resolver, runResolvers } from './resolvers.internal';

export const resolveData =
  <T extends Record<string, any>, H extends HookContext = HookContext>(
    ...resolvers: Resolver<T, H>[]
  ) =>
  async (context: H, next?: NextFunction) => {
    if (context.data !== undefined) {
      const data = context.data;

      const status = {
        originalContext: context,
      };

      if (Array.isArray(data)) {
        context.data = await Promise.all(
          data.map(current => runResolvers(resolvers, current, context, status)),
        );
      } else {
        context.data = await runResolvers(resolvers, data, context, status);
      }
    }

    if (typeof next === 'function') {
      return next();
    }
  };
