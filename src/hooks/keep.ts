import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import _has from 'lodash/has.js';

import { checkContextIf } from '../utils/check-context-if';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 */
export function keep<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(
        context,
        items.map(item => replaceItem(item, fieldNames))
      );
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
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
