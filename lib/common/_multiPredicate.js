const runPredicate = require('./_runPredicate');

/**
 * Used to run multiple predicate functions passed into the hook
 * and pass the array of results into the checkResults callback function
 */
module.exports = function multiPredicate (checkResults) {
  return function (...predicates) {
    return function (...fnArgs) {
      const promises = predicates.map(fn => runPredicate(fn, this, fnArgs));

      return Promise.all(promises)
        .then(checkResults);
    };
  };
};
