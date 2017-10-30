
const _remove = require('../common/_remove');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  return hook => {
    checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'discard');

    _remove(getItems(hook), fieldNames);

    return hook;
  };
};
