
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');

module.exports = function (context: any, type: any, methods: any, label: any) {
  if (type && context.type === type) {
    checkContext(context, type, methods, label);
  }
};
