
const getItems = require('./get-items');
const replaceItems = require('./replace-items');
const deleteByDot = require('../common/delete-by-dot');

module.exports = function (func) {
  return context => {
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      if (typeof func === 'function') {
        func(item);
      }

      removeProps('_computed', item);
      removeProps('_include', item);
      delete item._elapsed;
    });

    replaceItems(context, items);
    return context;
  };
};

function removeProps (name, item) {
  if (name in item) {
    item[name].forEach(key => { deleteByDot(item, key); });
    delete item[name];
  }
}
