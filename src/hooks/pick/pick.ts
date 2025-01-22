import _pick from 'lodash/pick.js';

import { checkContextIf, getItems, replaceItems } from '../../utils';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Keep certain fields in the record(s), deleting the rest.
 * @see https://hooks-common.feathersjs.com/hooks.html#keep
 *
 * @deprecated Use `pickData` or `pickResult` instead.
 */
export function pick<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(
        context,
        items.map(item => replaceItem(item, fieldNames)),
      );
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
}

export { pick as keep };

function replaceItem(item: any, fields: any) {
  if (typeof item !== 'object' || item === null) return item;

  return _pick(item, fields);
}
