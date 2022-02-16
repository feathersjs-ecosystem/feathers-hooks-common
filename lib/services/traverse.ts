
const _traverse = require('../common/_traverse');
const getItems = require('./get-items');

module.exports = function (converter, getObj) {
  return context => {
    const items = typeof getObj === 'function' ? getObj(context) : getObj || getItems(context);

    _traverse(items, converter);
    return context;
  };
};
