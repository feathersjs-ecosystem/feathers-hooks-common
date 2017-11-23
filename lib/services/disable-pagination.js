
const checkContext = require('./check-context');

module.exports = function () {
  return function (context) {
    checkContext(context, 'before', ['find'], 'disablePagination');
    const $limit = (context.params.query || {}).$limit;

    if ($limit === '-1' || $limit === -1) {
      context.params.paginate = false;
      delete context.params.query.$limit;
    }

    return context;
  };
};
