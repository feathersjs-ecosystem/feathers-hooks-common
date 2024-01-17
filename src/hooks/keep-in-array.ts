import { BadRequest } from '@feathersjs/errors';
import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import _has from 'lodash/has.js';
import { getItems } from '../utils/get-items';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Keep certain fields in a nested array inside the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keepinarray
 */
export function keepInArray<H extends HookContext = HookContext>(
  arrayName: string,
  fieldNames: string[],
) {
  return (context: H) => {
    const items = getItems(context);

    if (Array.isArray(items)) {
      items.forEach(item => replaceIn(item, arrayName, fieldNames));
    } else {
      replaceIn(items, arrayName, fieldNames);
    }

    return context;
  };
}

function replaceIn(item: any, field: any, fieldNames: any) {
  const target = _get(item, field);
  if (target) {
    if (!Array.isArray(target))
      throw new BadRequest(
        `The 'field' param must lead to array. found type '${typeof target}' instead`,
      );

    _set(
      item,
      field,
      target.map(item => replaceItem(item, fieldNames)),
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
