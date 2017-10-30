
const feathersErrors = require('feathers-errors');
const errors = feathersErrors.errors;

module.exports = function (predicate) {
  if (typeof predicate !== 'function') {
    throw new errors.MethodNotAllowed('Expected function as param. (isNot)');
  }

  return hook => {
    const result = predicate(hook); // Should we pass a clone? (safety vs performance)

    if (!result || typeof result.then !== 'function') {
      return !result;
    }

    return result.then(result1 => !result1);
  };
};
