
/* eslint no-param-reassign: 0 */

const getParameterNames = require('@avejidah/get-parameter-names');

var cbVarNames = ['cb', 'callback', 'callback_', 'done', 'next']; // eslint-disable-line no-var

/**
 * Add to or replace the variable names commonly used for callbacks.
 *
 * @param {string|Array.<string>} names - the variable name or names
 * @param {boolean} ifReplace - add to existing names or replace them
 */
const setCbVarNames = (names, ifReplace) => {
  if (!Array.isArray(names)) {
    names = [names];
  }

  if (ifReplace) {
    cbVarNames = [];
  }

  cbVarNames = cbVarNames.concat(names);
};

/**
 * Parse a function signature.
 * This routine is not intended for general use. Its exported only for testing purposes.
 *
 * @param {Function} func - the function to wrap
 * @returns {Array} parsed results [ paramCount, ifRest, ifCallback ]
 *    paramCount  Number of parameters in the function signature
 *    ifRest      If the last param was a rest param, e.g. '...rest'. paramCount does not
 *                include a count for the rest param if one was found.
 *    ifCallback  If the name of the last param is one commonly used for callbacks.
 */
const parseFunc = (func) => {
  /*
  // func.length excludes the rest param and only includes params before
  // the first one with a default value.
  const funcLen = func.length;
  */
  const paramNames = getParameterNames(func);
  const paramCount = paramNames.length;
  const cbName = paramCount ? paramNames[paramCount - 1] : '';

  // func.length does not include ...rest in (a, b, ...rest) => {}
  if (cbName.substr(0, 3) === '...' /* && paramCount === funcLen + 1 */) {
    return [paramCount - 1, true, false];
  }

  /*
  // Check if the parse worked. It has bugs with: (cb = () => {}) and (cb = (err, data) => {})
  if (paramCount !== funcLen) {
    throw new Error(`Func parsing error. Found ${paramCount} params not ${funcLen}. (parseFunc)`);
  }
  */

  if (paramCount === 0) {
    return [0, false, false];
  }

  // check if last param has a variable name typically given to callbacks
  return [paramCount, false, cbVarNames.indexOf(paramNames[paramCount - 1]) !== -1];
};

/**
 * Wrap any function into one that returns a promise.
 *
 * @param {Function} func - the function to wrap
 * @returns {Function} function which returns a promise
 *
 * The function signature is parsed to determine the number of parameters and their variable names.
 * The function is assumed to be one which calls a callback if the name of the last param is
 * a name commonly used for callbacks. The default names are
 *   cb, callback, callback_, done, and next
 * These may be changed using setCbVarNames.
 *
 * The parsing presently has bugs when dealing with named parameters whose default values
 * involve parenthesis or commas, e.g.
 *   function abc(a, b = () => {}, c) {}
 *   function abc(a, b = (x, y) => {}, c) {}
 *   function abc(a, b = 5 * (1 + 2), c) {}
 *   const abc = (a, b = 'x,y'.indexOf('y'), c) {};
 * These cases however rarely occur in practice.
 * Note that these cases disappear if the source is transpiled with Babel.
 *
 * The parsing will not work at all on a function which has been minified or uglified
 * because that will change the name of the callback param in the func signature.
 *
 * Recap:
 * - Use fnPromisifyCallback or fnPromisifySync instead on the front end.
 * - Watch out on the backend for the cases which cannot be parsed.
 * - You have no worries if you transpile with Babel on the backend (but do not minify).
 */
const fnPromisify = (func) => {
  const { paramsLen, ifRest, ifCallback } = parseFunc(func); // eslint-disable-line no-unused-vars

  return ifCallback ? fnPromisifyCallback(func, paramsLen - 1) : fnPromisifySync(func);
};

/**
 * Wrap a function calling a callback into one that returns a promise.
 *
 * @param {Function} func - the function to wrap
 * @param {?number|null} paramsCountBeforeCb - #params in func signature. Optional.
 *   The count includes the callback param.
 * @returns {Function} function which returns a promise
 *
 * The function signature is parsed to obtain the count if paramsCountBeforeCb is not provided.
 * The parsing presently has bugs in a few ES6 edge cases, as described in fnPromisify,
 * and an explicit count must be provided in those cases.
 * The parsing works correctly with transpiled and minified code.
 *
 * The wrapped func is always called with paramsCountBeforeCb params, the last of which is the
 * wrapper's own callback. A correct count ensures the wrapped func will be called correctly.
 *
 * function abc(a, b, c, callback) { callback(null, { data: 'data' }); }
 * const promiseFunc = fnPromisifyCallback(abc, 4);
 *
 * promiseFunc('a', 'b', 'c'); // abc('a', 'b', 'c', wrappersCb)
 * promiseFunc('a', 'b'); // abc('a', 'b', undefined, wrappersCb)
 * promiseFunc(); // abc(undefined, undefined, undefined, wrappersCb)
 * promiseFunc('a', 'b', 'c', 'd', 'e'); // abc('a', 'b', 'c', wrappersCb)
 *
 * No attempt to ensure the correct number of params is made if paramsCountBeforeCb is Infinity.
 * Every call to the wrapping func must have all the params specified other than the cb param.
 *
 * Example: A Feathersjs hook using a callback, now acts like a hook returning a promise.
 * ========
 * const delayedCreatedAt = () => (hook, next) => {
 *   setTimeout(() => {
 *     hook.data.createdAt = new Date();
 *     next(null, hook);
 *   }, 100);
 * };
 * const wrappedDelayedCreatedAt = fnPromisifyCallback(delayedCreatedAt(), 1);
 *
 * module.exports.before = {
 *   create: [wrappedDelayedCreatedAt], // returns a promise
 * };
 */
const fnPromisifyCallback = (func, paramsCountBeforeCb) => {
  // Get number of params needed before callback param
  if (typeof paramsCountBeforeCb === 'undefined') {
    paramsCountBeforeCb = getParameterNames(func).length - 1;
  }
  paramsCountBeforeCb = Math.max(paramsCountBeforeCb, 0);

  return (...args) => {
    const self = this;

    // Get the correct number of args
    if (paramsCountBeforeCb < Infinity) {
      const argsLen = args.length;
      if (argsLen < paramsCountBeforeCb) {
        // Array.apply(null, Array(5)) creates a dense array of 5 undefined
        const extraArgs = Array.apply(null, Array(paramsCountBeforeCb - argsLen));
        args = Array.prototype.concat.call(args, extraArgs);
      }
      if (args.length > paramsCountBeforeCb) {
        args = Array.prototype.slice.call(args, 0, paramsCountBeforeCb);
      }
    }

    return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
      args.push((err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });

      try {
        func.apply(self, args);
      } catch (err) {
        return reject(err);
      }
    });
  };
};

/**
 * Wrap a sync function into one that returns a promise.
 * A function which returns a promise may also be wrapped without harm, hence this routine
 * can wrap any function other than one calling a callback.
 *
 * @param {Function} func - the function to wrap
 * @returns {Function} function which returns a promise
 *
 * The promise will be rejected if the sync function throws.
 */
const fnPromisifySync = (func) => (...args) => {
  const self = this;

  return new Promise((resolve, reject) => {
    var res; // eslint-disable-line no-var

    try { // looking for a sync func to throw
      res = func.apply(self, args);
    } catch (err) {
      return reject(err);
    }

    // Return either a promise or a value. The Promise spec converts that value to a promise.
    return resolve(res);
  });
};

/**
 * Wrap any feathers hook so it returns a promise. Handles
 * - Sync function. Promise is rejected if the function throws.
 * - Function calling a callback. The call to the callback may be sync or async. Rejected on throw.
 * - Function returning a Promise. Basically a no-op.
 *
 * @param {Function} func - the function to wrap
 * @returns {Function} hook function which returns a promise
 *
 * Hook function signatures are either (hook) => {} or {hook, next) => {}.
 * The number of parameters determines if the hook function calls a callback or not.
 *
 * Example:
 * ========
 * const delayedCreatedAt = () => (hook, next) => {
 *   setTimeout(() => {
 *     hook.data.createdAt = new Date();
 *     next(null, hook);
 *   }, 100);
 * };
 * const updatedAt = () => (hook) => {
 *   hook.data.updatedAt = new Date();
 *   return hook;
 * };
 * const updatedBy = (email = 'email') => (hook) => {
 *   hook.data.email = hook.users[email];
 *   return Promise.resolve(hook);
 * );
 *
 * const wrappedDelayedCreatedAt = promisifyHook(delayedCreatedAt());
 * const wrappedUpdatedAt = promisifyHook(updatedAt());
 * const wrappedUpdatedBy = promisifyHook(updatedBy('userEmail'));
 *
 * module.exports.before = {
 *   create: [wrappedDelayedCreatedAt, wrappedUpdatedAt, wrappedUpdatedBy], // each return promise
 * };
 */
const promisifyHook = (func) => (
  func.length === 1 ? fnPromisifySync(func) : fnPromisifyCallback(func, 1)
);

export {
  getParameterNames,
  setCbVarNames,
  parseFunc,
  fnPromisify,
  fnPromisifyCallback,
  fnPromisifySync,
  promisifyHook,
};
