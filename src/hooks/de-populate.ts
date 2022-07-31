import type { Hook } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

/**
 * Remove records and properties created by the populate hook.
 * {@link https://hooks-common.feathersjs.com/hooks.html#depopulate}
 */
export function dePopulate (func?: any): Hook {
  return (context: any) => {
    const items = getItems(context);
    const converter = (item: any) => {
      if (typeof func === 'function') {
        func(item);
      }

      const keys = ['_elapsed', '_computed', '_include'];
      const { _computed = [], _include = [] } = item;

      return _omit(item, keys.concat(_computed).concat(_include));
    };
    const converted = Array.isArray(items) ? items.map(converter) : converter(items);

    replaceItems(context, converted);

    return context;
  };
}
