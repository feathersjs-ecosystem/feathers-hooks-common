
const _remove = require('../common/_remove');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  console.log('**Deprecated** The removeQuery hook will be removed next FeathersJS version. Use discardQuery instead.');

  return context => {
    checkContext(context, 'before', null, 'removeQuery');

    const query = (context.params || {}).query || {};
    _remove(query, fieldNames);

    return context;
  };
};
