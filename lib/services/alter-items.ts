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

    const results = (isArray ? items : [items]).map(item => func(item, context));

    const hasPromises = results.some(result =>
      typeof result === 'object' && result !== null && typeof result.then === 'function'
    );

    const setItem = (value, index) => {
      if (typeof value === 'object' && value !== null) {
        if (isArray) {
          items[index] = value;
        } else {
          items = value;
        }
      }
    };

    if (hasPromises) {
      return Promise.all(results)
        .then(values => {
          values.forEach(setItem);

          replaceItems(context, items);
          return context;
        });
    } else {
      results.forEach(setItem);

      replaceItems(context, items);
      return context;
    }
  };
};
