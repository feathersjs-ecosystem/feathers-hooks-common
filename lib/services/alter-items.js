
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
    const items = getItems(context);
    (Array.isArray(items) ? items : [items]).forEach(item => { func(item, context); });
    const isDone = replaceItems(context, items);

    if (!isDone || typeof isDone.then !== 'function') {
      return context;
    }

    return isDone.then(() => context);
  };
};
