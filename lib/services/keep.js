const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');
const existsByDot = require('../common/exists-by-dot');
const getByDot = require('../common/get-by-dot');
const setByDot = require('../common/set-by-dot');

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
