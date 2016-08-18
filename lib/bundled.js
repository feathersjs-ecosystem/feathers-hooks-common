'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lowerCase = lowerCase;
exports.removeQuery = removeQuery;
exports.pluckQuery = pluckQuery;
exports.remove = remove;
exports.pluck = pluck;
exports.disable = disable;
exports.populate = populate;

/* eslint-env es6, node */
/* eslint brace-style: 0, consistent-return: 0, no-param-reassign: 0 */

var errors = require('feathers-errors').errors;
var utils = require('./utils');

var getByDot = utils.getByDot;
var setByDot = utils.setByDot;

/**
 * Lowercase the given fields either in the data submitted (as a before hook for create,
 * update or patch) or in the result (as an after hook). If the data is an array or
 * a paginated find result the hook will lowercase the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to lowercase. Dot notation is supported.
 * @returns {Function} hook function(hook).
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */
function lowerCase() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  var lowerCaseFields = function lowerCaseFields(data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        var value = getByDot(data, field);

        if (value !== undefined) {
          if (typeof value !== 'string' && value !== null) {
            throw new errors.BadRequest('Expected string data. (lowercase ' + field + ')');
          }

          setByDot(data, field, value ? value.toLowerCase() : value);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function () {
    return true;
  };

  return function (hook) {
    var items = hook.type === 'before' ? hook.data : hook.result;

    var update = function update(condition) {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(lowerCaseFields);
        } else {
          lowerCaseFields(items);
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
function removeQuery() {
  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fields[_key2] = arguments[_key2];
  }

  var removeQueries = function removeQueries(data) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var field = _step2.value;

        var value = getByDot(data, field); // prevent setByDot creating nested empty objects
        if (value !== undefined) {
          setByDot(data, field, undefined, true);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function () {
    return true;
  };

  return function (hook) {
    if (hook.type === 'after') {
      var provider = hook.params.provider || 'server';
      throw new errors.GeneralError('Provider \'' + provider + '\' cannot remove query params on after hook. (removeQuery)');
    }
    var result = hook.params.query;
    var update = function update(condition) {
      if (result && condition) {
        removeQueries(result);
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to retain. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
function pluckQuery() {
  for (var _len3 = arguments.length, fields = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fields[_key3] = arguments[_key3];
  }

  var pluckQueries = function pluckQueries(data) {
    var plucked = {};

    fields.forEach(function (field) {
      var value = getByDot(data, field); // prevent setByDot creating nested empty objects
      if (value !== undefined) {
        setByDot(plucked, field, value);
      }
    });

    return plucked;
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function () {
    return true;
  };

  return function (hook) {
    if (hook.type === 'after') {
      throw new errors.GeneralError('Provider \'' + hook.params.provider + '\' can not pluck query params on after hook. (pluckQuery)');
    }
    var result = hook.params.query;
    var update = function update(condition) {
      if (result && condition) {
        hook.params.query = pluckQueries(result);
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields either from the data submitted (as a before hook for create,
 * update or patch) or from the result (as an after hook). If the data is an array or
 * a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
function remove() {
  for (var _len4 = arguments.length, fields = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fields[_key4] = arguments[_key4];
  }

  var removeFields = function removeFields(data) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var field = _step3.value;

        var value = getByDot(data, field); // prevent setByDot creating nested empty objects
        if (value !== undefined) {
          setByDot(data, field, undefined, true);
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function (hook) {
    return !!hook.params.provider;
  };

  return function (hook) {
    var result = hook.type === 'before' ? hook.data : hook.result;
    var update = function update(condition) {
      if (result && condition) {
        if (Array.isArray(result)) {
          result.forEach(removeFields);
        } else {
          removeFields(result);

          if (result.data) {
            if (Array.isArray(result.data)) {
              result.data.forEach(removeFields);
            } else {
              removeFields(result.data);
            }
          }
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the provided fields either from the data submitted
 * (as a before hook for create, update or patch) or from the result (as an after hook).
 * If the data is an array or a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
function pluck() {
  for (var _len5 = arguments.length, fields = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    fields[_key5] = arguments[_key5];
  }

  var pluckFields = function pluckFields(data) {
    var plucked = {};

    fields.forEach(function (field) {
      var value = getByDot(data, field); // prevent setByDot creating nested empty objects
      if (value !== undefined) {
        setByDot(plucked, field, value);
      }
    });

    return plucked;
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function (hook) {
    return !!hook.params.provider;
  };

  return function (hook) {
    var update = function update(condition) {
      var updateInner = function updateInner(result, method) {
        if (result) {
          if (Array.isArray(result)) {
            result = result.map(pluckFields);
          } else if (method === 'find' && result.data) {
            result.data = result.data.map(pluckFields);
          } else {
            result = pluckFields(result);
          }
        }

        return result;
      };

      if (condition) {
        if (hook.type === 'before') {
          hook.data = updateInner(hook.data, hook.method);
        } else {
          hook.result = updateInner(hook.result, hook.method);
        }
      }

      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Disable access to a service method completely, for a specific provider,
 * or for a custom condition.
 *
 * @param {?string|function} realm - Provider, or function(hook):boolean|Promise
 *    The first provider or the custom condition.
 *    null = disable completely,
 *    'external' = disable external access,
 *    string = disable that provider e.g. 'rest',
 *    func(hook) = returns boolean or promise resolving to a boolean. false = disable access.
 * @param {string|string[]} [args] - Additional provider names.
 * @returns {Function} hook function(hook)
 *
 * The function may be invoked with
 * - no param, or with undefined or null. All providers are disallowed, even the server.
 * - multiple params of provider names, e.g. rest, socketio. They are all disabled.
 * - 'external'. All client interfaces are disabled.
 * - a function whose signature is func(hook). It returns either a boolean or a promise which
 * resolves to a boolean. If false, the operation is disabled. This is the only way to disable
 * calls from the server.
 */
function disable(realm) {
  if (!realm) {
    return function (hook) {
      throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
    };
  }

  if (typeof realm === 'function') {
    return function (hook) {
      var result = realm(hook);
      var update = function update(check) {
        if (!check) {
          throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
        }
      };

      if (result && typeof result.then === 'function') {
        return result.then(update);
      }

      update(result);
    };
  }

  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  var providers = [realm].concat(args);

  return function (hook) {
    var provider = hook.params.provider;

    if (realm === 'external' && provider || providers.indexOf(provider) !== -1) {
      throw new errors.MethodNotAllowed('Provider \'' + hook.params.provider + '\' can not call \'' + hook.method + '\'. (disable)\'');
    }
  };
}

/**
 * The populate hook uses a property from the result (or every item if it is a list)
 * to retrieve a single related object from a service and add it to the original object.
 * It is meant to be used as an after hook on any service method.
 *
 * @param {string} target - The prop name to contain the populated item or array of populated items.
 *    This is also the default for options.field if that is not specified.
 * @param {Object} options - options
 *    For a mongoose model, these are the options for item.toObject().
 *    For a Sequelize model, these are the options for item.toJSON().
 * @param {string} options.service - The service for the related object, e.g. '/messages'.
 * @param {string|Array.<string>} options.field - The field containing the key(s)
 *    for the item(s) in options.service.
 * @returns {Function} hook function(hook):Promise resolving to the hook.
 *
 * 'target' is the foreign key for one related item in options.service, e.g. target === item._id.
 * 'target' is set to this related item once it is read successfully.
 *
 * So if the hook result has the message item
 *    { _id: '1...1', senderId: 'a...a', text: 'Jane, are you there?' }
 * and then the hook is run
 *    hooks.populate('senderId', { field: 'user', service: '/users' })
 * the hook result will contain
 *    { _id: '1...1', senderId : 'a...a', text: 'Jane, are you there?',
 *      user: { _id: 'a...a', name: 'John Doe'} }
 *
 * If 'senderId' is an array of keys, then 'user' will be an array of populated items.
 */
function populate(target, options) {
  options = Object.assign({}, options);

  if (!options.service) {
    throw new Error('You need to provide a service. (populate)');
  }

  var field = options.field || target;

  return function (hook) {
    function populate1(item) {
      if (!item[field]) {
        return Promise.resolve(item);
      }

      // Find by the field value by default or a custom query
      var id = item[field];

      // If it's a mongoose model then
      if (typeof item.toObject === 'function') {
        item = item.toObject(options);
      }
      // If it's a Sequelize model
      else if (typeof item.toJSON === 'function') {
          item = item.toJSON(options);
        }
      // Remove any query from params as it's not related
      var params = Object.assign({}, params, { query: undefined });
      // If the relationship is an array of ids, fetch and resolve an object for each,
      // otherwise just fetch the object.
      var promise = Array.isArray(id) ? Promise.all(id.map(function (objectID) {
        return hook.app.service(options.service).get(objectID, params);
      })) : hook.app.service(options.service).get(id, params);
      return promise.then(function (relatedItem) {
        if (relatedItem) {
          item[target] = relatedItem;
        }
        return item;
      });
    }

    if (hook.type !== 'after') {
      throw new errors.GeneralError('Can not populate on before hook. (populate)');
    }

    var isPaginated = hook.method === 'find' && hook.result.data;
    var data = isPaginated ? hook.result.data : hook.result;

    if (Array.isArray(data)) {
      return Promise.all(data.map(populate1)).then(function (results) {
        if (isPaginated) {
          hook.result.data = results;
        } else {
          hook.result = results;
        }

        return hook;
      });
    }

    // Handle single objects.
    return populate1(hook.result).then(function (item) {
      hook.result = item;
      return hook;
    });
  };
}