
/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */

const traverser = require('traverse');
const errors = require('feathers-errors').errors;
import { processHooks } from 'feathers-hooks/lib/commons';

import { checkContext, getItems } from './utils';

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

  // Babel 6.17.0 does not transpile the following correctly
  // const runHooks = hooks => hooks ? combine(...hooks).call(this, hook) : hook;
  var that = this;
  var runHooks = function (hooks) {
    return hooks ? combine.apply(that, hooks).call(that, hook) : hook;
  };

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

export const iff = (ifFcn, ...rest) => {
  const trueHooks = [].concat(rest);

  const iffWithoutElse = function (hook) {
    return iffElse(ifFcn, trueHooks, null).call(this, hook);
  };
  iffWithoutElse.else = (...falseHooks) => iffElse(ifFcn, trueHooks, falseHooks);

  return iffWithoutElse;
};

/**
 * Alias for iff
 */

export const when = iff;

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

export const some = (...rest) => function (hook) {
  const hooks = rest.map(fn => fn.call(this, hook));

  return Promise.all(hooks).then(results => {
    return Promise.resolve(results.some(result => !!result));
  });
};

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

export const every = (...rest) => function (hook) {
  const hooks = rest.map(fn => fn.call(this, hook));

  return Promise.all(hooks).then(results => {
    return Promise.resolve(results.every(result => !!result));
  });
};

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
export const unless = (unlessFcn, ...rest) => {
  if (typeof unlessFcn === 'function') {
    return iff(isNot(unlessFcn), ...rest);
  }

  return iff(!unlessFcn, ...rest);
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

/**
 * Move props from hook.query.$client to hook.params.
 *
 * @param {string|Array.string} whitelist - list of prop names allowed.
 * @returns {Object} hook
 *
 * Example:
 * // on client:
 * service.find({ query: { dept: 'a', $client: ( populate: 'po-1', serialize: 'po-mgr' } } } );
 * // on server
 * service.before({ all: [ client, myHook ]});
 * // myHook hook.params is
 *   { query: { dept: 'a' }, populate: 'po-1', serialize: 'po-mgr' } }
 */
export const client = (...whitelist) => hook => {
  whitelist = typeof whitelist === 'string' ? [whitelist] : whitelist;
  const params = hook.params;

  if (params && params.query && params.query.$client && typeof params.query.$client === 'object') {
    const client = params.query.$client;

    whitelist.forEach(key => {
      if (key in client) {
        params[key] = client[key];
      }
    });

    delete params.query.$client;
  }

  return hook;
};

/**
 * Validate JSON object using ajv (synchronous)
 *
 * @param {Object} schema - json schema (//github.com/json-schema/json-schema)
 * @param {Function} Ajv - import Ajv from 'ajv'
 * @param {Object?} options - ajv options
 *    addNewError optional  reducing function (previousErrs, ajvError, itemsLen, index)
 *                          to format err.errors in the thrown error
 *                default   addNewErrorDflt returns an array of error messages.
 * @returns {undefined}
 * @throws if hook does not match the schema. err.errors contains the error messages.
 *
 * Tutorial: //code.tutsplus.com/tutorials/validating-data-with-json-schema-part-1--cms-25343
 */
export const validateSchema = (schema, Ajv, options = { allErrors: true }) => {
  const addNewError = options.addNewError || addNewErrorDflt;
  delete options.addNewError;
  const validate = new Ajv(options).compile(schema); // for fastest execution

  return hook => {
    const items = getItems(hook);
    const itemsArray = Array.isArray(items) ? items : [items];
    const itemsLen = itemsArray.length;
    let errorMessages;
    let invalid = false;

    itemsArray.forEach((item, index) => {
      if (!validate(item)) {
        invalid = true;

        validate.errors.forEach(ajvError => {
          errorMessages = addNewError(errorMessages, ajvError, itemsLen, index);
        });
      }
    });

    if (invalid) {
      throw new errors.BadRequest('Invalid schema', { errors: errorMessages });
    }
  };
};

function addNewErrorDflt (errorMessages, ajvError, itemsLen, index) {
  const leader = itemsLen === 1 ? '' : `in row ${index + 1} of ${itemsLen}, `;
  let message;

  if (ajvError.dataPath) {
    message = `'${leader}${ajvError.dataPath.substring(1)}' ${ajvError.message}`;
  } else {
    message = `${leader}${ajvError.message}`;
    if (ajvError.params && ajvError.params.additionalProperty) {
      message += `: '${ajvError.params.additionalProperty}'`;
    }
  }

  return (errorMessages || []).concat(message);
}

/*
 * Traverse objects and modifies values in place
 *
 * @param {function} converter - conversion function(node).
 *    See details at https://github.com/substack/js-traverse
 * @param {function|object?} getObj - object or function(hook) to get object. Optional.
 *    Default is items in hook.data or hook.result.
 *
 * Example - trim strings
 * const trimmer = function (node) {
 *   if (typeof node === 'string') { this.update(node.trim()); }
 * };
 * service.before({ create: traverse(trimmer) });
 *
 * Example - REST HTTP request uses string 'null' in query. Replace them with value null.
 * const nuller = function (node) {
 *   if (node === 'null') { this.update(null); }
 * };
 * service.before({ find: traverse(nuller, hook => hook.params.query) });
 *
 */
export const traverse = (converter, getObj) => hook => {
  if (typeof getObj === 'function') {
    var items = getObj(hook);
  } else {
    items = getObj || getItems(hook);
  }

  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });

  return hook;
};
