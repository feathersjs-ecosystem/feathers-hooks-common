
const _traverse = require('../common/_traverse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (converter: any, getObj: any) {
  return (context: any) => {
    const items = typeof getObj === 'function' ? getObj(context) : getObj || getItems(context);

    _traverse(items, converter);
    return context;
  };
};
