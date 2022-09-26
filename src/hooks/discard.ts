import _omit from 'lodash/omit.js';
import { checkContextIf } from '../utils/check-context-if';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';
import type { Application, Hook, Service } from '@feathersjs/feathers';

/**
 * Delete certain fields from the record(s).
 * @see https://hooks-common.feathersjs.com/hooks.html#discard
 */
export function discard<A extends Application = Application, S extends Service = Service>(
  ...fieldNames: string[]
): Hook<A, S> {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    const items = getItems(context);
    const convert = (item: any) => _omit(item, fieldNames);
    const converted = Array.isArray(items) ? items.map(convert) : convert(items);

    replaceItems(context, converted);

    return context;
  };
}
