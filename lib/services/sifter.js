
const errors = require('feathers-errors');
const checkContext = require('./check-context');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (getSifter) {
  return hook => {
    checkContext(hook, 'after', 'find', 'sifter');

    if (typeof getSifter !== 'function') {
      throw new errors.BadRequest(`The sifter param must be a function. (sifter)`);
    }

    const sifter = getSifter(hook);

    if (typeof sifter !== 'function') {
      throw new errors.BadRequest(`The result of calling the sifter param must be a function. (sifter)`);
    }

    replaceItems(hook, getItems(hook).filter(sifter));

    return hook;
  };
};
