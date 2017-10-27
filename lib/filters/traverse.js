
const _traverse = require('../common/_traverse');

module.exports = function (converter, getObj) {
  return (data, connection, hook) => {
    const items = typeof getObj === 'function' ? getObj(data, connection, hook) : getObj || data;

    _traverse(items, converter);
  };
};
