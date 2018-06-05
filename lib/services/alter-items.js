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
      (item, index) => {
        let resultPromise = func(item, context);

        // If the result is not a promise, wrap it in one
        if (!resultPromise || typeof resultPromise.then !== 'function') {
          resultPromise = Promise.resolve(resultPromise);
        }

        return resultPromise.then(result => {
          if (typeof result === 'object' && result !== null) {
            if (isArray) {
              items[index] = result;
            } else {
              items = result;
            }
          }
        });
      }
    );

    return Promise.all(promises)
      .then(() => replaceItems(context, items))
      .then(() => context);
  };
};
