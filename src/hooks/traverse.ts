import type { Application, HookContext, Service } from '@feathersjs/feathers';
import { traverse as _traverse } from '../common';
import type { SyncContextFunction } from '../types';
import { getItems } from '../utils/get-items';

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * {@link https://hooks-common.feathersjs.com/hooks.html#traverse}
 */
export function traverse <A = Application, S = Service> (
  transformer: (transformContext: any) => any,
  getObject?: (SyncContextFunction<any, A, S>)
): (context: HookContext<A, S>) => HookContext<A, S> {
  return (context: HookContext<A, S>) => {
    const items = typeof getObject === 'function' ? getObject(context) : getObject || getItems(context);

    _traverse(items, transformer);
    return context;
  };
}
