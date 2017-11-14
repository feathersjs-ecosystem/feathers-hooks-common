
const _pluck = require('../common/_pluck');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (...fieldNames) {
  console.log("**Deprecated** The pluck hook will be removed next FeathersJS version. Use iff(isProvider('external'), keep(fieldNames)) instead.");

  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'pluck');

    if (context.params.provider) {
      replaceItems(context, _pluck(getItems(context), fieldNames));
    }

    return context;
  };
};
