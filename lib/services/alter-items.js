
const errors = require('@feathersjs/errors');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (func) {
  if (!func) {
    func = () => { };
  }

  if (typeof func !== 'function') {
    throw new errors.BadRequest('Function required. (alter)');
  }

  return context => {
    let items = getItems(context);
    const isArray = Array.isArray(items);

    const promises = (isArray ? items : [items]).map(
      async (item, index) => {
        let result = func(item, context);

        if (result && typeof result.then === 'function') {
          result = await result
        }

        if (typeof result === 'object' && result !== null) {
          if (isArray) {
            items[index] = result;
          } else {
            items = result;
          }
        }
      }
    );

    return Promise.all(promises)
      .then(() => replaceItems(context, items))
      .then(() => context)
  };
};
