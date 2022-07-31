import type { Hook } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';
import { checkContextIf } from './check-context-if';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

/**
 * Delete certain fields from the record(s).
 * {@link https://hooks-common.feathersjs.com/hooks.html#discard}
 */
export function discard (...fieldNames: string[]): Hook {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    const items = getItems(context);
    const convert = (item: any) => _omit(item, fieldNames);
    const converted = Array.isArray(items) ? items.map(convert) : convert(items);

    replaceItems(context, converted);

    return context;
  };
}
