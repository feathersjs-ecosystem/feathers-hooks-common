
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

    const runProcessFuncArray = funcs => processFuncArray.call(this, fnArgs, funcs);

    const check = typeof predicate === 'function' ? predicate(...fnArgs) : !!predicate;

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

/**
 * Hook to conditionally execute one or another set of hooks.
 *
 * @param {Function|Promise|boolean} ifFcn - Predicate function(hook).
 * @param {Array.function|Function} trueHooks - Hook functions to execute when ifFcn is truthy.
 * @param {Array.function|Function} falseHooks - Hook functions to execute when ifFcn is falsey.
 * @returns {Object} resulting hook
 *
 * The predicate is called with hook as a param.
 *   const isServer = hook => !hook.params.provider;
 *   iff(isServer, hook.remove( ... ));
 * You can use a high order predicate to access other values.
 *   const isProvider = provider => hook => hook.params.provider === provider;
 *   iff(isProvider('socketio'), hook.remove( ... ));
 *
 * The hook functions may be sync, return a Promise, or use a callback.
 * feathers-hooks will catch any errors from the predicate or hook Promises.
 *
 * Examples
 * iffElse(isServer, [hookA, hookB], hookC)
 *
 * iffElse(isServer,
 *   [ hookA, iffElse(hook => hook.method === 'create', hook1, [hook2, hook3]), hookB ],
 *   iffElse(isProvider('rest'), [hook4, hook5], hook6])
 * )
 */

/**
 * Hook to conditionally execute one or another set of hooks using function chaining.
 *
 * @param {Function|Promise|boolean} ifFcn - Predicate function(hook).
 * @param {Array.function} rest - Hook functions to execute when ifFcn is truthy.
 * @returns {Function} iffWithoutElse
 *
 * Examples:
 * iff(isServer, hookA, hookB)
 *   .else(hookC)
 *
 * iff(isServer,
 *   hookA,
 *   iff(isProvider('rest'), hook1, hook2, hook3)
 *     .else(hook4, hook5),
 *   hookB
 * )
 *   .else(
 *     iff(hook => hook.method === 'create', hook6, hook7)
 *   )
 */

/**
 * Alias for iff
 */

/**
 * Hook that executes a set of hooks and returns true if at least one of
 * the hooks returns a truthy value and false if none of them do.
 *
 * @param {Array.function} rest - Hook functions to execute.
 * @returns {Boolean}
 *
 * Example 1
 * service.before({
 *   create: hooks.iff(hooks.some(hook1, hook2, ...), hookA, hookB, ...)
 * });
 *
 * Example 2 - called within a custom hook function
 * function (hook) {
 *   ...
 *   hooks.some(hook1, hook2, ...).call(this, currentHook)
 *     .then(bool => { ... });
 * }
 */

/**
 * Hook that executes a set of hooks and returns true if all of
 * the hooks returns a truthy value and false if one of them does not.
 *
 * @param {Array.function} rest - Hook functions to execute.
 * @returns {Boolean}
 *
 * Example 1
 * service.before({
 *    create: hooks.iff(hooks.every(hook1, hook2, ...), hookA, hookB, ...)
 * });
 *
 * Example 2 - called within a custom hook function
 * function (hook) {
 *   ...
 *   hooks.every(hook1, hook2, ...).call(this, currentHook)
 *     .then(bool => { ... })
 * }
 */

/**
 * Hook to conditionally execute one or another set of hooks using function chaining.
 * if the predicate hook function returns a falsey value.
 * Equivalent to iff(isNot(isProvider), hook1, hook2, hook3).
 *
 * @param {Function|Promise|boolean} unlessFcn - Predicate function(hook).
 * @param {Array.function} rest - Hook functions to execute when unlessFcn is falsey.
 * @returns {Function} iffWithoutElse
 *
 * Examples:
 * unless(isServer, hookA, hookB)
 *
 * unless(isServer,
 *   hookA,
 *   unless(isProvider('rest'), hook1, hook2, hook3),
 *   hookB
 * )
 */

/**
 * Negate a predicate.
 *
 * @param {Function} predicate - returns a boolean or a promise resolving to a boolean.
 * @returns {boolean} the not of the predicate result.
 *
 * const hooks, { iff, isNot, isProvider } from 'feathers-hooks-common';
 * iff(isNot(isProvider('rest')), hooks.remove( ... ));
 */
