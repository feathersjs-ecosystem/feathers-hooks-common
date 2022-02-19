import getByDot from 'lodash/get';
import setByDot from 'lodash/set';
import existsByDot from 'lodash/has';

import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';
import type { Hook } from '@feathersjs/feathers';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Keep}
 */
export function keep (
  ...fieldNames: string[]
): Hook {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(context, items.map(item => replaceItem(item, fieldNames)));
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
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
