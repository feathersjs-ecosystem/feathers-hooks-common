import { Hook } from '@feathersjs/feathers';
import omit from 'lodash/omit';
import {getItems} from './get-items';
import {replaceItems} from './replace-items';

/**
 * Remove records and properties created by the populate hook.
 * {@link https://hooks-common.feathersjs.com/hooks.html#DePopulate}
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

      return omit(item, keys.concat(_computed).concat(_include));
    };
    const converted = Array.isArray(items) ? items.map(converter) : converter(items);

    replaceItems(context, converted);

    return context;
  };
}
