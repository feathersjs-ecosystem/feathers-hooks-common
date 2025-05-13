import type { HookContext, NextFunction } from '@feathersjs/feathers';
import type { SyncContextFunction } from '../../types';
import { replaceResult } from '../../utils/replace-items/replace-result';

export const sifter =
  <H extends HookContext = HookContext>(siftFunc: SyncContextFunction<(item: any) => boolean, H>) =>
  async (context: H, next?: NextFunction) => {
    const sifter = siftFunc(context);

    if (next) {
      await next();
    }

    return replaceResult(context, item => item, {
      transform: items => items.filter(sifter),
    });
  };
