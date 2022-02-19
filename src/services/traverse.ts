import { Hook } from '@feathersjs/feathers';
import _traverse from '../common/_traverse';
import { SyncContextFunction } from '../types';
import {getItems} from './get-items';

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * {@link https://hooks-common.feathersjs.com/hooks.html#Traverse}
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
