
const errors = require('@feathersjs/errors');
const runPredicate = require('./_runPredicate');

module.exports = function (predicate) {
  if (typeof predicate !== 'function') {
    throw new errors.MethodNotAllowed('Expected function as param. (isNot)');
  }

  return context => runPredicate(predicate, this, context) // Should we pass a clone? (safety vs performance)
    .then(result => !result)
};
