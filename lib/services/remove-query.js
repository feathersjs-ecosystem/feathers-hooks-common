
const _remove = require('../common/_remove');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  return hook => {
    checkContext(hook, 'before', null, 'removeQuery');

    const query = (hook.params || {}).query || {};
    _remove(query, fieldNames);

    return hook;
  };
};
