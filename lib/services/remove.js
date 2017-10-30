
const _remove = require('../common/_remove');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  console.log('DEPRECATED. Use discard. (remove)');

  return hook => {
    checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'remove');

    if (hook.params.provider) {
      _remove(getItems(hook), fieldNames);
    }

    return hook;
  };
};
