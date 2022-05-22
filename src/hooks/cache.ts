import type { Hook } from '@feathersjs/feathers';
import type { CacheMap, CacheOptions } from '../types';
import { getItems } from '../utils/get-items';

const defaultMakeCacheKey = (key: any) => key;

/**
 * Persistent, most-recently-used record cache for services.
 * {@link https://hooks-common.feathersjs.com/hooks.html#cache}
 */
export function cache <T, K extends keyof T> (
  cacheMap: CacheMap<T>,
  keyField?: K,
  options?: CacheOptions<T, K>
): Hook {
  const clone = options?.clone || defaultClone;
  const makeCacheKey = options?.makeCacheKey || defaultMakeCacheKey;

  return (context: any) => {
    keyField = keyField || (context.service || {}).id; // Will be undefined on client

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
        return;
      }

      if (query.$select) return;

      items.forEach((item: any) => {
        const idName = getIdName(keyField, item);
        const key = makeCacheKey(item[idName]);
        cacheMap.set(key, clone(item));
      });

      return;
    }

    switch (context.method) {
    case 'find': // fall through
    case 'remove': // skip remove in before remove
    case 'create':
      return;
    case 'get': {
      if (!Object.keys(query).length) {
        const key = makeCacheKey(context.id);
        const value = cacheMap.get(key);
        if (value) context.result = value;
      }
      return context;
    } default: // update, patch, remove
      if (context.id) {
        cacheMap.delete(context.id);
        return;
      }

      items.forEach((item: any) => {
        const idName = getIdName(keyField, item);
        const key = makeCacheKey(item[idName]);
        cacheMap.delete(key);
      });
    }
  };
}

function getIdName (keyField: any, item: any) {
  if (keyField) return keyField;
  return ('_id' in item) ? '_id' : 'id';
}

function defaultClone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
