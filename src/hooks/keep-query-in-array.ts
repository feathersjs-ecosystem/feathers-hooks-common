import { checkContext } from '../utils/check-context';
import { BadRequest } from '@feathersjs/errors';
import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import _has from 'lodash/has.js';
import type { Application, Hook, Service } from '@feathersjs/feathers';

/**
 * Keep certain fields in a nested array inside the query object, deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepqueryinarray
 */
export function keepQueryInArray<A extends Application = Application, S extends Service = Service>(
  arrayName: string,
  fieldNames: string[]
): Hook<A, S> {
  return context => {
    checkContext(context, 'before', null, 'keepQueryInArray');

    replaceIn(context.query, arrayName, fieldNames);

    return context;
  };
}

function replaceIn(item: any, field: any, fieldNames: any) {
  const target = _get(item, field);
  if (target) {
    if (!Array.isArray(target))
      throw new BadRequest(
        `The 'field' param must lead to array. found type '${typeof target}' instead`
      );

    _set(
      item,
      field,
      target.map(item => replaceItem(item, fieldNames))
    );
  }
}

function replaceItem(item: any, fields: any) {
  if (typeof item !== 'object' || item === null) return item;

  const newItem = {};
  fields.forEach((field: any) => {
    if (!_has(item, field)) return;

    const value = _get(item, field);
    _set(newItem, field, value);
  });
  item = newItem;
  return item;
}
