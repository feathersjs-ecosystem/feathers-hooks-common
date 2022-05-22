import type { Hook } from '@feathersjs/feathers';
import { traverse as _traverse } from '../common';
import type { SyncContextFunction } from '../types';
import { getItems } from '../utils/get-items';

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * {@link https://hooks-common.feathersjs.com/hooks.html#traverse}
 */
export function traverse (
  transformer: (this: any, transformContext: any) => any,
  getObject?: SyncContextFunction<any>
): Hook {
  return (context: any) => {
    const items = typeof getObject === 'function' ? getObject(context) : getObject || getItems(context);

    _traverse(items, transformer);
    return context;
  };
}
