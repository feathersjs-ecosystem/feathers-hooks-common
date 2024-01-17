import type { HookContext, Id } from '@feathersjs/feathers';
import { getItems } from '../utils/get-items';
import { clone as defaultClone } from '../common/clone';

export type CacheMap<T> = Map<string | number, T>;

export interface CacheOptions<T> {
  clone?(item: T): T;
  makeCacheKey?(id: Id): string;
}

const defaultMakeCacheKey = (key: any) => key;

/**
 * Persistent, most-recently-used record cache for services.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#cache
 */
export function cache<H extends HookContext = HookContext, T = any>(
  cacheMap: CacheMap<T>,
  keyField?: string,
  options?: CacheOptions<T>,
) {
  const clone = options?.clone || defaultClone;
  const makeCacheKey = options?.makeCacheKey || defaultMakeCacheKey;

  return (context: H) => {
    keyField = keyField || context.service?.id; // Will be undefined on client

    let items = getItems(context);
    items = Array.isArray(items) ? items : [items];

    const query = context.params.query || {};

    if (context.type === 'after') {
      if (context.method === 'remove') {
        items.forEach((item: any) => {
          const idName = getIdName(keyField, item);
          const key = makeCacheKey(item[idName]);
          cacheMap.delete(key);
        });
        return context;
      }

      if (query.$select) return context;

      items.forEach((item: any) => {
        const idName = getIdName(keyField, item);
        const key = makeCacheKey(item[idName]);
        cacheMap.set(key, clone(item));
      });

      return context;
    }

    switch (context.method) {
      case 'find': // fall through
      case 'remove': // skip remove in before remove
      case 'create':
        return context;
      case 'get': {
        if (!Object.keys(query).length) {
          const key = makeCacheKey(context.id!);
          const value = cacheMap.get(key);
          if (value) context.result = value;
        }
        return context;
      }
      default: // update, patch, remove
        if (context.id) {
          cacheMap.delete(context.id);
          return context;
        }

        items.forEach((item: any) => {
          const idName = getIdName(keyField, item);
          const key = makeCacheKey(item[idName]);
          cacheMap.delete(key);
        });
    }

    return context;
  };
}

function getIdName(keyField: any, item: any) {
  if (keyField) return keyField;
  return '_id' in item ? '_id' : 'id';
}
