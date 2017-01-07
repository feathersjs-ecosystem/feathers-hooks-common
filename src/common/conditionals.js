
const errors = require('feathers-errors').errors;

// processFuncArray must handle case of null param.
module.exports = function Conditionals (processFuncArray) {
  if (!(this instanceof Conditionals)) {
    return new Conditionals(processFuncArray);
  }

  // fnArgs is [hook] for service & permission hooks, [data, connection, hook] for event filters
  const iffElse = (predicate, trueFuncs, falseFuncs) => function (...fnArgs) {
    if (typeof trueFuncs === 'function') { trueFuncs = [trueFuncs]; }
    if (typeof falseFuncs === 'function') { falseFuncs = [falseFuncs]; }

    // Babel-core 6.17.0 did not properly transpile the following when coded as an arrow func
    var that = this;
    var runProcessFuncArray = function (funcs) {
      return processFuncArray.call(that, fnArgs, funcs);
    };

    // Babel-core 6.17.0 transpiled const check = typeof predicate === 'function' ? predicate(...fnArgs) : !!predicate;
    // as var check = typeof predicate === 'function' ? predicate.apply(undefined, fnArgs) : !!predicate;
    var check = typeof predicate === 'function' ? predicate.apply(that, fnArgs) : !!predicate;

    if (!check) {
      return runProcessFuncArray(falseFuncs);
    }

    if (typeof check.then !== 'function') {
      return runProcessFuncArray(trueFuncs);
    }

    return check.then(check1 => runProcessFuncArray(check1 ? trueFuncs : falseFuncs));
  };

  const iff = (predicate, ...rest) => {
    const trueHooks = [].concat(rest);

    const iffWithoutElse = function (hook) {
      return iffElse(predicate, trueHooks, null).call(this, hook);
    };
    iffWithoutElse.else = (...falseHooks) => iffElse(predicate, trueHooks, falseHooks);

    return iffWithoutElse;
  };

  const unless = (unlessFcn, ...rest) => {
    if (typeof unlessFcn === 'function') {
      return iff(isNot(unlessFcn), ...rest);
    }

    return iff(!unlessFcn, ...rest);
  };

  const some = (...rest) => function (...fnArgs) {
    const promises = rest.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.some(result => !!result));
    });
  };

  const every = (...rest) => function (...fnArgs) {
    const promises = rest.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.every(result => !!result));
    });
  };

  const isNot = (predicate) => {
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

  return {
    iffElse,
    iff,
    when: iff,
    unless,
    some,
    every,
    isNot
  };
};
