const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');
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
  const newItem = {};
  fields.forEach(field => {
    const value = getByDot(item, field);
    if (typeof value !== 'undefined' && value !== null) {
      setByDot(newItem, field, value);
    }
  });
  item = newItem;
  return item;
}
