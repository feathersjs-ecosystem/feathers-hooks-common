
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');

module.exports = function () {
  return function (context: any) {
    checkContext(context, 'before', ['find'], 'disablePagination');
    const $limit = (context.params.query || {}).$limit;

    if ($limit === '-1' || $limit === -1) {
      context.params.paginate = false;
      delete context.params.query.$limit;
    }

    return context;
  };
};
