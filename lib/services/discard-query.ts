const omit = require('lodash/omit');

const checkContext = require('./check-context');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'discardQuery');

    const query = (context.params || {}).query || {};

    context.params.query = omit(query, fieldNames);

    return context;
  };
};
