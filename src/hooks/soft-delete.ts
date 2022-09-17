import { GeneralError } from '@feathersjs/errors';
import type { SoftDeleteOptions } from '../types';
import { checkContext } from '../utils/check-context';

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
export function softDelete ({
  deletedQuery = defaultQuery,
  removeData = defaultData
}: SoftDeleteOptions = {}) {
  return async (context: any) => {
    const { service, method, params, app } = context;
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
