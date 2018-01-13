const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');
const existsByDot = require('../common/exists-by-dot');
const getByDot = require('../common/get-by-dot');
const setByDot = require('../common/set-by-dot');

module.exports = function (...fieldNamesOrFunc) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(context, items.map(item => replaceItem(item, getFieldNames(fieldNamesOrFunc, item, context))));
    } else {
      replaceItems(context, replaceItem(items, getFieldNames(fieldNamesOrFunc, items, context)));
    }

    return context;
  };
};

function getFieldNames (fieldNamesOrFunc, item, context) {
  if (typeof fieldNamesOrFunc[0] === 'function') {
    const result = fieldNamesOrFunc[0](item, context);
    return Array.isArray(result) ? result : [result];
  }
  return fieldNamesOrFunc;
}

function replaceItem (item, fields) {
  const newItem = {};
  fields.forEach(field => {
    if (!existsByDot(item, field)) return;

    const value = getByDot(item, field);
    setByDot(newItem, field, value);
  });
  item = newItem;
  return item;
}
