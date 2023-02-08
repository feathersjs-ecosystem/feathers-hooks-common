import type { HookContext, NextFunction } from '@feathersjs/feathers';
import type { HookFunction } from '../types';

export const afterAround = <H extends HookContext>(regularHook: HookFunction<H>) => {
  return async (context: H, next: NextFunction) => {
    await next();
    return await regularHook(context);
  };
};
