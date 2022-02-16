
module.exports = function (processFuncArray) {
  return function (predicate, trueFuncs, falseFuncs) {
    // fnArgs is [context] for service & permission hooks, [data, connection, context] for event filters
    return function (...fnArgs) {
      if (typeof trueFuncs === 'function') { trueFuncs = [trueFuncs]; }
      if (typeof falseFuncs === 'function') { falseFuncs = [falseFuncs]; }

      // Babel 6.17.0 did not transpile something in the old version similar to this
      // const runProcessFuncArray = funcs => processFuncArray.call(this, fnArgs, funcs);
      const that = this;
      const runProcessFuncArray = function (funcs) {
        return processFuncArray.call(that, fnArgs, funcs);
      };

      // const check = typeof predicate === 'function' ? predicate(...fnArgs) : !!predicate;
      const check = typeof predicate === 'function' ? predicate.apply(that, fnArgs) : !!predicate;

      if (!check) {
        return runProcessFuncArray(falseFuncs);
      }

      if (typeof check.then !== 'function') {
        return runProcessFuncArray(trueFuncs);
      }

      return check.then(check1 => runProcessFuncArray(check1 ? trueFuncs : falseFuncs));
    };
  };
};
