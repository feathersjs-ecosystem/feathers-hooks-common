import type { HookContext, NextFunction } from '@feathersjs/feathers';
import type { HookFunction } from '../types';

export const beforeAround = <H extends HookContext>(regularHook: HookFunction<H>) => {
  return async (context: H, next: NextFunction) => {
    await regularHook(context);
    return next();
  };
};
