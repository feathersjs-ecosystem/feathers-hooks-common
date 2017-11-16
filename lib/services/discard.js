
const _remove = require('../common/_remove');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    _remove(getItems(context), fieldNames);

    return context;
  };
};
