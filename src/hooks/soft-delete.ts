import type { HookContext } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

export type SoftDeleteOptionFunction<H extends HookContext = HookContext> = (
  context?: H,
) => Promise<{ [key: string]: any }>;

export interface SoftDeleteOptions<H extends HookContext = HookContext> {
  deletedQuery?: { [key: string]: any } | SoftDeleteOptionFunction<H>;
  removeData?: { [key: string]: any } | SoftDeleteOptionFunction<H>;
}

const defaultQuery = { deleted: { $ne: true } };
const defaultData = { deleted: true };
const getValue = (value: any, ...args: any[]) => {
  if (typeof value === 'function') {
    return Promise.resolve(value(...args));
  }
  return Promise.resolve(value);
};

/**
 * Allow to mark items as deleted instead of removing them.
 */
export function softDelete<H extends HookContext = HookContext>({
  deletedQuery = defaultQuery,
  removeData = defaultData,
}: SoftDeleteOptions<H> = {}) {
  return async (context: H) => {
    const { service, method, params } = context;
    // @ts-ignore
    const { disableSoftDelete, query = {} } = params;

    checkContext(context, 'before', null, 'softDelete');

    if (disableSoftDelete) {
      return context;
    }

    const deleteQuery = await getValue(deletedQuery, context);

    context.params.query = Object.assign({}, query, deleteQuery);

    if (method === 'remove') {
      const data = await getValue(removeData, context);
      const result = await service.patch(context.id, data, params);

      context.result = result;
    }

    return context;
  };
}
