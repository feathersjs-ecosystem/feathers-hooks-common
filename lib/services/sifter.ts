
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (getSifter) {
  return context => {
    checkContext(context, 'after', 'find', 'sifter');

    if (typeof getSifter !== 'function') {
      throw new errors.BadRequest('The sifter param must be a function. (sifter)');
    }

    const sifter = getSifter(context);

    if (typeof sifter !== 'function') {
      throw new errors.BadRequest('The result of calling the sifter param must be a function. (sifter)');
    }

    replaceItems(context, getItems(context).filter(sifter));

    return context;
  };
};
