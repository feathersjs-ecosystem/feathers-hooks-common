import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { checkContext, getResultIsArray } from '../../utils';
import { KeyOf, MaybeArray } from '../../internal.utils';

export type OnDeleteAction = 'cascade' | 'set null';

export interface OnDeleteOptions<Path extends string = string> {
  service: Path;
  keyThere: string;
  keyHere: string;
  onDelete: OnDeleteAction;
  /**
   * If true, the hook will wait for the service to finish before continuing
   *
   * @default false
   */
  blocking?: boolean;
}

/**
 * hook to manipulate related items on delete
 */
export const onDelete = <S = Record<string, any>, H extends HookContext = HookContext>(
  options: MaybeArray<OnDeleteOptions<KeyOf<S>>>,
) => {
  const optionsMulti = Array.isArray(options) ? options : [options];

  return async (context: H, next?: NextFunction) => {
    checkContext(context, ['after', 'around'], 'remove', 'onDelete');

    if (next) {
      await next();
    }

    const { result } = getResultIsArray(context);

    if (!result.length) {
      return context;
    }

    const promises: Promise<any>[] = [];

    optionsMulti.forEach(async ({ keyHere, keyThere, onDelete, service, blocking }) => {
      let ids = result.map(x => x[keyHere]).filter(x => !!x);
      ids = [...new Set(ids)];

      if (!ids || ids.length <= 0) {
        return context;
      }

      const params = {
        query: {
          ...(ids.length === 1 ? { [keyThere]: ids[0] } : { [keyThere]: { $in: ids } }),
        },
        paginate: false,
      };

      let promise: Promise<any> | undefined = undefined;

      if (onDelete === 'cascade') {
        promise = context.app.service(service as string).remove(null, params);
      } else if (onDelete === 'set null') {
        const data = { [keyThere]: null };
        promise = context.app.service(service as string).patch(null, data, params);
      }

      if (blocking) {
        promises.push(promise);
      }
    });

    if (promises.length) {
      await Promise.all(promises);
    }

    return context;
  };
};
