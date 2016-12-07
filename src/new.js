
/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */

const errors = require('feathers-errors').errors;
import { processHooks } from 'feathers-hooks/lib/commons';

import { checkContext } from './utils';

/**
 * Mark an item as deleted rather than removing it from the database.
 *
 * @param {string} field - Field for delete status. Supports dot notation. Default is 'deleted'.
 *
 * export.before = {
 *   all: softDelete()
 * };
 */
export const softDelete = field => {
  const deleteField = field || 'deleted';

  return function (hook) {
    const service = this;
    hook.data = hook.data || {};
    hook.params.query = hook.params.query || {};
    checkContext(hook, 'before', null, 'softDelete');

    if (hook.params.query.$disableSoftDelete) {
      delete hook.params.query.$disableSoftDelete;
      return hook;
    }

    switch (hook.method) {
      case 'find':
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'get':
        return throwIfItemDeleted(hook.id)
          .then(() => hook);
      case 'create':
        return hook;
      case 'update': // fall through
      case 'patch':
        if (hook.id) {
          return throwIfItemDeleted(hook.id)
            .then(() => hook);
        }
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'remove':
        return Promise.resolve()
          .then(() => hook.id ? throwIfItemDeleted(hook.id) : null)
          .then(() => {
            hook.data[deleteField] = true;
            hook.params.query[deleteField] = { $ne: true };
            hook.params.query.$disableSoftDelete = true;

            return service.patch(hook.id, hook.data, hook.params)
              .then(result => {
                hook.result = result;
                return hook;
              });
          });
    }

    function throwIfItemDeleted (id) {
      return service.get(id, { query: { $disableSoftDelete: true } })
        .then(data => {
          if (data[deleteField]) {
            throw new errors.NotFound('Item has been soft deleted.');
          }
        })
        .catch(() => {
          throw new errors.NotFound('Item not found.');
        });
    }
  };
};

/**
 * Hook to execute multiple hooks
 *
 * @param {Array.function} rest - Hook functions to execute.
 * @returns {Object} resulting hook
 *
 * Example 1
 * service.before({
 *   create: hooks.combine(hook1, hook2, ...) // same as [hook1, hook2, ...]
 * });
 *
 * Example 2 - called within a custom hook function
 * function (hook) {
 *   ...
 *   return hooks.combine(hook1, hook2, ...).call(this, currentHook)
 *     .then(hook => { ... });
 * }
 */
export const combine = (...rest) => function (hook) {
  return processHooks.call(this, rest, hook);
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
export const iffElse = (ifFcn, trueHooks, falseHooks) => (hook) => {
  if (typeof trueHooks === 'function') { trueHooks = [trueHooks]; }
  if (typeof falseHooks === 'function') { falseHooks = [falseHooks]; }

  const runHooks = hooks => hooks ? combine(...hooks).call(this, hook) : hook;

  const check = typeof ifFcn === 'function' ? ifFcn(hook) : !!ifFcn;

  if (!check) {
    return runHooks(falseHooks);
  }

  if (typeof check.then !== 'function') {
    return runHooks(trueHooks);
  }

  return check.then(check1 => runHooks(check1 ? trueHooks : falseHooks));
};

/**
 * Hook to conditionally execute one or another set of hooks using function chaining.
 *
 * @param {Function|Promise|boolean} ifFcn - Predicate function(hook).
 * @param {Array.function} rest - Hook functions to execute when ifFcn is truesy.
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

export const iff = (ifFcn, ...rest) => {
  const trueHooks = [].concat(rest);

  const iffWithoutElse = function (hook) {
    return iffElse(ifFcn, trueHooks, null).call(this, hook);
  };
  iffWithoutElse.else = (...falseHooks) => iffElse(ifFcn, trueHooks, falseHooks);

  return iffWithoutElse;
};

/**
 * Hook that executes a set of hooks and returns true if at least one of
 * the hooks returns a truthy value and false if none of them do.
 *
 * @param {Array.function} rest - Hook functions to execute.
 * @returns {Boolean}
 *
 * Example 1
 * service.before({
 *   create: hooks.some(hook1, hook2, ...) // same as [hook1, hook2, ...]
 * });
 *
 * Example 2 - called within a custom hook function
 * function (hook) {
 *   ...
 *   return hooks.some(hook1, hook2, ...).call(this, currentHook)
 *     .then(hook => { ... });
 * }
 */

export const some = (...rest) => (hook) => {
  const hooks = rest.map(fn => {
    let promise;

    try {
      promise = fn.call(this, hook).catch(() => Promise.resolve(false));
    } catch (error) {
      promise = Promise.resolve(false);
    }

    return promise;
  });

  return Promise.all(hooks).then(results => {
    return Promise.resolve(results.some(result => !!result));
  });
};

/**
 * Predicate to check what called the service method.
 *
 * @param {string} [providers] - Providers permitted
 *    'server' = service method called from server,
 *    'external' = any external access,
 *    string = that provider e.g. 'rest',
 * @returns {boolean} whether the service method was called by one of the [providers].
 */
export const isProvider = (...providers) => {
  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return function (hook) { // allow bind
    const hookProvider = (hook.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
    (provider === 'server' && !hookProvider) ||
    (provider === 'external' && hookProvider)
    );
  };
};

/**
 * Negate a predicate.
 *
 * @param {Function} predicate - returns a boolean or a promise resolving to a boolean.
 * @returns {boolean} the not of the predicate result.
 *
 * const hooks, { iff, isNot, isProvider } from 'feathers-hooks-common';
 * iff(isNot(isProvider('rest')), hooks.remove( ... ));
 */
export const isNot = (predicate) => {
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
