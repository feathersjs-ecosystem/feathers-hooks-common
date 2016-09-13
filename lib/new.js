'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNot = exports.isProvider = exports.iff = exports.softDelete = undefined;

var _utils = require('./utils');

/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */

var errors = require('feathers-errors').errors;


/**
 * Mark an item as deleted rather than removing it from the database.
 *
 * @param {string} field - Field for delete status. Supports dot notation. Default is 'deleted'.
 *
 * export.before = {
 *   remove: [ softDelete() ], // update item flagging it as deleted
 *   find: [ softDelete() ] // ignore deleted items
 * };
 */
var softDelete = exports.softDelete = function softDelete(field) {
  return function (hook) {
    (0, _utils.checkContext)(hook, 'before', ['remove', 'find'], 'softDelete');

    if (hook.method === 'find') {
      hook.params.query = hook.params.query || {};
      (0, _utils.setByDot)(hook.data, (field || 'deleted') + '.$ne', true); // include non-deleted items only
      return hook;
    }

    hook.data = hook.data || {};
    (0, _utils.setByDot)(hook.data, field || 'deleted', true); // update the item as deleted

    return undefined.patch(hook.id, hook.data, hook.params).then(function (data) {
      hook.result = data; // Set the result from `patch` as the method call result
      return hook; // Always return the hook or `undefined`
    });
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
var iff = exports.iff = function iff(ifFcn, hookFcn) {
  return function (hook) {
    var check = typeof ifFcn === 'function' ? ifFcn(hook) : !!ifFcn;

    if (!check) {
      return hook;
    }

    if (typeof check.then !== 'function') {
      return hookFcn(hook); // could be sync or async
    }

    return check.then(function (check1) {
      if (!check1) {
        return hook;
      }

      return hookFcn(hook); // could be sync or async
    });
  };
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
var isProvider = exports.isProvider = function isProvider() {
  for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
    providers[_key] = arguments[_key];
  }

  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return function (hook) {
    // allow bind
    var hookProvider = (hook.params || {}).provider;

    return providers.some(function (provider) {
      return provider === hookProvider || provider === 'server' && !hookProvider || provider === 'external' && hookProvider;
    });
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
var isNot = exports.isNot = function isNot(predicate) {
  if (typeof predicate !== 'function') {
    throw new errors.MethodNotAllowed('Expected function as param. (isNot)');
  }

  return function (hook) {
    var result = predicate(hook); // Should we pass a clone? (safety vs performance)

    if (!result || typeof result.then !== 'function') {
      return !result;
    }

    return result.then(function (result1) {
      return !result1;
    });
  };
};