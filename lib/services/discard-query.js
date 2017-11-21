
const _remove = require('../common/_remove');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'discardQuery');

    const query = (context.params || {}).query || {};
    _remove(query, fieldNames);

    return context;
  };
};
