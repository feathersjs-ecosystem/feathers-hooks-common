const omit = require('lodash/omit');

const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (func) {
  return context => {
    const items = getItems(context);
    const converter = item => {
      if (typeof func === 'function') {
        func(item);
      }

      const keys = ['_elapsed', '_computed', '_include'];
      const { _computed = [], _include = [] } = item;

      return omit(item, keys.concat(_computed).concat(_include));
    };
    const converted = Array.isArray(items) ? items.map(converter) : converter(items);

    replaceItems(context, converted);

    return context;
  };
};
