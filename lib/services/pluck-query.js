
const _pluck = require('../common/_pluck');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  console.log('**Deprecated** The pluckQuery hook will be removed next FeathersJS version. Use keepQuery instead.');

  return context => {
    checkContext(context, 'before', null, 'pluckQuery');

    const query = (context.params || {}).query || {};
    context.params.query = _pluck(query, fieldNames);

    return context;
  };
};
