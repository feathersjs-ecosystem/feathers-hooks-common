const runPredicate = require('./_runPredicate');

module.exports = function (processFuncArray) {
  return function (predicate, trueFuncs, falseFuncs) {
    // fnArgs is [context] for service & permission hooks, [data, connection, context] for event filters
    return function (...fnArgs) {
      if (typeof trueFuncs === 'function') { trueFuncs = [trueFuncs]; }
      if (typeof falseFuncs === 'function') { falseFuncs = [falseFuncs]; }

      return runPredicate(predicate, this, fnArgs)
        .then(result => processFuncArray.call(this, fnArgs, result ? trueFuncs : falseFuncs));
    };
  };
};
