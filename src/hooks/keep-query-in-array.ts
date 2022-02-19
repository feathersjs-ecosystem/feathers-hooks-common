import { checkContext } from '../utils/check-context';
import { BadRequest } from '@feathersjs/errors';
import getByDot from 'lodash/get';
import setByDot from 'lodash/set';
import existsByDot from 'lodash/has';
import type { Hook } from '@feathersjs/feathers';

/**
 * Keep certain fields in a nested array inside the query object, deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#KeepQueryInArray}
 */
export function keepQueryInArray (
  arrayName: string,
  fieldNames: string[]
): Hook {
  return (context: any) => {
    checkContext(context, 'before', null, 'keepQueryInArray');

    replaceIn(context.query, arrayName, fieldNames);

    return context;
  };
}

function replaceIn (item: any, field: any, fieldNames: any) {
  const target = getByDot(item, field);
  if (target) {
    if (!Array.isArray(target)) throw new BadRequest(`The 'field' param must lead to array. found type '${typeof target}' instead`);

    setByDot(item, field, target.map(item => replaceItem(item, fieldNames)));
  }
}

function replaceItem (item: any, fields: any) {
  if (typeof item !== 'object' || item === null) return item;

  const newItem = {};
  fields.forEach((field: any) => {
    if (!existsByDot(item, field)) return;

    const value = getByDot(item, field);
    setByDot(newItem, field, value);
  });
  item = newItem;
  return item;
}
