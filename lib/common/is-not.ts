
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (predicate: any) {
  if (typeof predicate !== 'function') {
    throw new errors.MethodNotAllowed('Expected function as param. (isNot)');
  }

  return (context: any) => {
    const result = predicate(context); // Should we pass a clone? (safety vs performance)

    if (!result || typeof result.then !== 'function') {
      return !result;
    }

    return result.then((result1: any) => !result1);
  };
};
