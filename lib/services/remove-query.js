
const _remove = require('../common/_remove');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  console.log('**Deprecated** The removeQuery hook will be removed next FeathersJS version. Use discardQuery instead.');

  return hook => {
    checkContext(hook, 'before', null, 'removeQuery');

    const query = (hook.params || {}).query || {};
    _remove(query, fieldNames);

    return hook;
  };
};
