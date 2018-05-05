
const errors = require('@feathersjs/errors');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (func) {
  if (!func) {
    func = () => {};
  }

  if (typeof func !== 'function') {
    throw new errors.BadRequest('Function required. (alter)');
  }

  return context => {
    let items = getItems(context);
    const isArray = Array.isArray(items);

    [].concat(items).forEach(
      (item, index) => {
        const result = func(item, context);
        if (typeof result === 'object' && result !== null) {
          if (isArray) {
            items[index] = result;
          } else {
            items = result;
          }
        }
      }
    );

    replaceItems(context, items);
    return context;
  };
};
