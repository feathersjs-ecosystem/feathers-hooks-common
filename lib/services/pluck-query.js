
const _pluck = require('../common/_pluck');
const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'pluckQuery');

    const query = (context.params || {}).query || {};
    context.params.query = _pluck(query, fieldNames);

    return context;
  };
};
