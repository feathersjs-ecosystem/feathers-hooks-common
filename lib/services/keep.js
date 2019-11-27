const getByDot = require('lodash/get');
const setByDot = require('lodash/set');
const existsByDot = require('lodash/has');

const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(context, items.map(item => replaceItem(item, fieldNames)));
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
};

function replaceItem (item, fields) {
  if (typeof item !== 'object' || item === null) return item;

  const newItem = {};
  fields.forEach(field => {
    if (!existsByDot(item, field)) return;

    const value = getByDot(item, field);
    setByDot(newItem, field, value);
  });
  item = newItem;
  return item;
}
