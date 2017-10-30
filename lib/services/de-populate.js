
const getItems = require('./get-items');
const replaceItems = require('./replace-items');
const deleteByDot = require('../common/delete-by-dot');

module.exports = function () {
  return hook => {
    const items = getItems(hook);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      removeProps('_computed', item);
      removeProps('_include', item);
      delete item._elapsed;
    });

    replaceItems(hook, items);
    return hook;
  };
};

function removeProps (name, item) {
  if (name in item) {
    item[name].forEach(key => { deleteByDot(item, key); });
    delete item[name];
  }
}
