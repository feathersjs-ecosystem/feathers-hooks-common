import { GeneralError } from '@feathersjs/errors';
import type { Application, Hook, HookContext, Service } from '@feathersjs/feathers';
import { checkContext } from '../utils/check-context';

export type SoftDeleteOptionFunction<A extends Application, S extends Service> = (
  context?: HookContext<A, S>
) => Promise<{ [key: string]: any }>;

export interface SoftDeleteOptions<A extends Application, S extends Service> {
  deletedQuery?: { [key: string]: any } | SoftDeleteOptionFunction<A, S>;
  removeData?: { [key: string]: any } | SoftDeleteOptionFunction<A, S>;
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
export function softDelete<A extends Application = Application, S extends Service = Service>({
  deletedQuery = defaultQuery,
  removeData = defaultData,
}: SoftDeleteOptions<A, S> = {}): Hook<A, S> {
  return async context => {
    const { service, method, params, app } = context;
    // @ts-ignore
    const { disableSoftDelete, query = {} } = params;

    if (app.version < '4.0.0') {
      throw new GeneralError('The softDelete hook requires Feathers 4.0.0 or later');
    }

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
