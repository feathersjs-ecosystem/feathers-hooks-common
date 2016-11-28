
/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */

const errors = require('feathers-errors').errors;

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
 * Hook to conditionally execute another hook.
 *
 * @param {Function|Promise|boolean} ifFcn - Predicate function(hook).
 *    Execute hookFcn if result is truesy.
 * @param {Function|Promise} hookFcn - Hook function to execute.
 * @returns {Object} hook
 *
 * The predicate is called with hook as a param.
 *   const isServer = hook => !hook.params.provider;
 *   iff(isServer, hook.remove( ... ));
 * You can use a high order predicate to access other values.
 *   const isProvider = provider => hook => hook.params.provider === provider;
 *   iff(isProvider('socketio'), hook.remove( ... ));
 *
 * feathers-hooks will catch any errors from the predicate or hook Promises.
 */
export const iff = (ifFcn, hookFcn) => (hook) => {
  const check = typeof ifFcn === 'function' ? ifFcn(hook) : !!ifFcn;

  if (!check) {
    return hook;
  }

  if (typeof check.then !== 'function') {
    return hookFcn(hook); // could be sync or async
  }

  return check.then(check1 => {
    if (!check1) {
      return hook;
    }

    return hookFcn(hook); // could be sync or async
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
