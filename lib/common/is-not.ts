
const errors = require('@feathersjs/errors');

module.exports = function (predicate) {
  if (typeof predicate !== 'function') {
    throw new errors.MethodNotAllowed('Expected function as param. (isNot)');
  }

  return context => {
    const result = predicate(context); // Should we pass a clone? (safety vs performance)

    if (!result || typeof result.then !== 'function') {
      return !result;
    }

    return result.then(result1 => !result1);
  };
};
