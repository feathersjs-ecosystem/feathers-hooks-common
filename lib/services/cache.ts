
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

const defaultMakeCacheKey = (key: any) => key;

module.exports = function (cacheMap: any, keyFieldName: any, options = {}) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clone' does not exist on type '{}'.
  const clone = options.clone || defaultClone;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'makeCacheKey' does not exist on type '{}... Remove this comment to see the full error message
  const makeCacheKey = options.makeCacheKey || defaultMakeCacheKey;

  return (context: any) => {
    keyFieldName = keyFieldName || (context.service || {}).id; // Will be undefined on client

    let items = getItems(context);
    items = Array.isArray(items) ? items : [items];

    const query = context.params.query || {};

    if (context.type === 'after') {
      if (context.method === 'remove') {
        items.forEach((item: any) => {
          const idName = getIdName(keyFieldName, item);
          const key = makeCacheKey(item[idName]);
          cacheMap.delete(key);
        });
        return;
      }

      if (query.$select) return;

      items.forEach((item: any) => {
        const idName = getIdName(keyFieldName, item);
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
          const idName = getIdName(keyFieldName, item);
          const key = makeCacheKey(item[idName]);
          cacheMap.delete(key);
        });
    }
  };
};

function getIdName (keyFieldName: any, item: any) {
  if (keyFieldName) return keyFieldName;
  return ('_id' in item) ? '_id' : 'id';
}

function defaultClone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
