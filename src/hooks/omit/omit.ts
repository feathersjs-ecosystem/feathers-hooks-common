import _omit from 'lodash/omit.js';
import { getItems, replaceItems, checkContextIf } from '../../utils';
import type { HookContext } from '@feathersjs/feathers';
import { replaceData } from '../../utils/replace-items/replace-data';

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 *
 * @deprecated Use the explicit 'omitData' or 'omitResult' hooks instead.
 */
export function omit<H extends HookContext = HookContext>(...fieldNames: string[]) {
  return (context: H) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    const items = getItems(context);
    const convert = (item: any) => _omit(item, fieldNames);
    const converted = Array.isArray(items) ? items.map(convert) : convert(items);

    replaceItems(context, converted);

    return replaceData(context, (item: any) => _omit(item, fieldNames));
  };
}

// alias
export { omit as discard };
