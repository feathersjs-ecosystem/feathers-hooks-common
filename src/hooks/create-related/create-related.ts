import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { checkContext, getResultIsArray } from '../../utils';
import { MaybeArray, Promisable } from '../../internal.utils';

export interface CreateRelatedOptions<S = Record<string, any>> {
  service: keyof S;
  multi?: boolean;
  data: (item: any, context: HookContext) => Promisable<Record<string, any>>;
}

/**
 * hook to create related items
 */
export function createRelated<S = Record<string, any>, H extends HookContext = HookContext>(
  options: MaybeArray<CreateRelatedOptions<S>>,
) {
  return async (context: H, next?: NextFunction) => {
    checkContext(context, ['after', 'around'], undefined, 'createRelated');

    if (next) {
      await next();
    }

    const { result } = getResultIsArray(context);

    const entries = Array.isArray(options) ? options : [options];

    await Promise.all(
      entries.map(async entry => {
        const { data, service, multi } = entry;

        const dataToCreate = (
          await Promise.all(result.map(async item => data(item, context)))
        ).filter(x => !!x);

        if (!dataToCreate || dataToCreate.length <= 0) {
          return context;
        }

        if (multi || dataToCreate.length === 1) {
          await context.app
            .service(service as string)
            .create(dataToCreate.length === 1 ? dataToCreate[0] : dataToCreate);
        } else {
          await Promise.all(
            dataToCreate.map(async item => context.app.service(service as string).create(item)),
          );
        }
      }),
    );

    return context;
  };
}
