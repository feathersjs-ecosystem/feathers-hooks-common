
// processFuncArray must handle case of null param.
export default function (processFuncArray) {
// fnArgs is [hook] for service & permission hooks, [data, connection, hook] for event filters
  return function (predicate, trueFuncs, falseFuncs) {
    return function (...fnArgs) {
      if (typeof trueFuncs === 'function') { trueFuncs = [trueFuncs]; }
      if (typeof falseFuncs === 'function') { falseFuncs = [falseFuncs]; }

      // Babel 6.17.0 did not transpile something in the old version similar to this
      // const runProcessFuncArray = funcs => processFuncArray.call(this, fnArgs, funcs);
      var that = this;
      var runProcessFuncArray = function (funcs) {
        return processFuncArray.call(that, fnArgs, funcs);
      };

      // const check = typeof predicate === 'function' ? predicate(...fnArgs) : !!predicate;
      var check = typeof predicate === 'function' ? predicate.apply(that, fnArgs) : !!predicate;

      if (!check) {
        return runProcessFuncArray(falseFuncs);
      }

      if (typeof check.then !== 'function') {
        return runProcessFuncArray(trueFuncs);
      }

      return check.then(check1 => runProcessFuncArray(check1 ? trueFuncs : falseFuncs));
    };
  };
}
