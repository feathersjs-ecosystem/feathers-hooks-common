
const _traverse = require('../common/_traverse');
const getItems = require('./get-items');

module.exports = function (converter, getObj) {
  return hook => {
    const items = typeof getObj === 'function' ? getObj(hook) : getObj || getItems(hook);

    _traverse(items, converter);
    return hook;
  };
};
