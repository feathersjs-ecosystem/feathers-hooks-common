import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import _omit from 'lodash/omit.js';

import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';
import type { SerializeSchema, SyncContextFunction } from '../types';
import type { Hook } from '@feathersjs/feathers';

/**
 * Prune values from related records. Calculate new values.
 * {@link https://hooks-common.feathersjs.com/hooks.html#serialize}
 */
export function serialize (
  schema1: SerializeSchema | SyncContextFunction<SerializeSchema>
): Hook {
  return (context: any) => {
    const schema = typeof schema1 === 'function' ? schema1(context) : schema1;
    const schemaDirectives = ['computed', 'exclude', 'only'];

    replaceItems(context, serializeItems(getItems(context), schema));
    return context;

    function serializeItems (items: any, schema: any) {
      if (!Array.isArray(items)) {
        return serializeItem(items, schema);
      }

      return items.map(item => serializeItem(item, schema));
    }

    function serializeItem (item: any, schema: any) {
      const computed: Record<string, any> = {};
      Object.keys(schema.computed || {}).forEach(name => {
        computed[name] = schema.computed[name](item, context); // needs closure
      });

      let only = schema.only;
      only = typeof only === 'string' ? [only] : only;
      if (only) {
        const newItem = {};
        only.concat('_include', '_elapsed', item._include || []).forEach((key: any) => {
          const value = _get(item, key);
          if (value !== undefined) {
            _set(newItem, key, value);
          }
        });
        item = newItem;
      }

      let exclude = schema.exclude;
      exclude = typeof exclude === 'string' ? [exclude] : exclude;
      if (exclude) {
        item = _omit(item, exclude);
      }

      const _computed = Object.keys(computed);
      item = Object.assign({}, item, computed, _computed.length ? { _computed } : {});

      Object.keys(schema).forEach(key => {
        if (!schemaDirectives.includes(key) && typeof item[key] === 'object') { // needs closure
          item[key] = serializeItems(item[key], schema[key]);
        }
      });

      return item;
    }
  };
}
