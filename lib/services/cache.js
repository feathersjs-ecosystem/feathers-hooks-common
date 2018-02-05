
const getItems = require('./get-items');

module.exports = function (cacheMap, keyFieldName, options = {}) {
  const clone = options.clone || defaultClone;

  return context => {
    keyFieldName = keyFieldName || (context.service || {}).id; // Will be undefined on client

    let items = getItems(context);
    items = Array.isArray(items) ? items : [items];

    if (context.type === 'after') {
      if (context.method === 'remove') return;

      items.forEach(item => {
        const idName = getIdName(keyFieldName, item);
        cacheMap.set(item[idName], clone(item));
      });

      return;
    }

    switch (context.method) {
      case 'find': // fall through
      case 'create':
        return;
      case 'get':
        const value = cacheMap.get(context.id);

        if (value) context.result = value;
        return context;
      default: // update, patch, remove
        if (context.id) {
          cacheMap.delete(context.id);
          return;
        }

        items.forEach(item => {
          const idName = getIdName(keyFieldName, item);
          cacheMap.delete(item[idName]);
        });
    }
  };
};

function getIdName (keyFieldName, item) {
  if (keyFieldName) return keyFieldName;
  return ('_id' in item) ? '_id' : 'id';
}

function defaultClone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
