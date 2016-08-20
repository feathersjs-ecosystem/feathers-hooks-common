'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.setByDot = setByDot;
exports.checkContext = checkContext;
exports.getItems = getItems;
exports.replaceItems = replaceItems;

/* eslint no-param-reassign: 0 */

/**
 * Get a value from an object using dot notation, e.g. employee.address.city
 *
 * @param {Object} obj - The object containing the value
 * @param {string} path - The path to the value, e.g. employee.address.city
 * @returns {*} The value, or undefined if the path does not exist
 *
 * There is no way to differentiate between non-existent paths and a value of undefined
 */
var getByDot = exports.getByDot = function getByDot(obj, path) {
  return path.split('.').reduce(function (obj1, part) {
    return (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) === 'object' ? obj1[part] : undefined;
  }, obj);
};

/**
 * Set a value in an object using dot notation, e.g. employee.address.city.
 *
 * @param {Object} obj - The object
 * @param {string} path - The path where to place the value, e.g. employee.address.city
 * @param {*} value - The value.
 * @param {boolean} ifDelete - Delete the prop at path if value is undefined.
 * @returns {Object} The modified object.
 *
 * To delete a prop, set value = undefined and ifDelete = true. Note that
 * new empty inner objects will still be created,
 * e.g. setByDot({}, 'a.b.c', undefined, true) will return {a: b: {} )
 */
function setByDot(obj, path, value, ifDelete) {
  var parts = path.split('.');
  var lastIndex = parts.length - 1;
  return parts.reduce(function (obj1, part, i) {
    if (i !== lastIndex) {
      if (!obj1.hasOwnProperty(part) || _typeof(obj1[part]) !== 'object') {
        obj1[part] = {};
      }
      return obj1[part];
    }

    obj1[part] = value;
    if (value === undefined && ifDelete) {
      delete obj1[part];
    }
    return obj1;
  }, obj);
}

/**
 * Restrict the calling hook to a hook type (before, after) and a set of
 * hook methods (find, get, create, update, patch, remove).
 *
 * @param {object} hook object
 * @param {string|null} type permitted. 'before', 'after' or null for either.
 * @param {array|string} methods permitted. find, get, create, update, patch, remove or null for any
 * @param {string} label identifying hook in error messages. optional.
 *
 * Example:
 * const checkContext = require('feathers-hooks-utils').checkContext;
 *
 * const includeCreatedAtHook = (options) => {
 *   const fieldName = (options && options.as) ? options.as : 'createdAt';
 *   return (hook) => {
 *     checkContext(hook, 'before', 'create', 'includeCreatedAtHook');
 *     hook.data[fieldName] = new Date());
 *   };
 * },
 *
 * Examples:
 * checkContext(hook, 'before', ['update', 'patch'], 'hookName');
 * checkContext(hook, null, ['update', 'patch']);
 * checkContext(hook, 'before', null, 'hookName');
 * checkContext(hook, 'before');
 */

function checkContext(hook) {
  var type = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var methods = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var label = arguments.length <= 3 || arguments[3] === undefined ? 'anonymous' : arguments[3];

  if (type && hook.type !== type) {
    throw new Error('The \'' + label + '\' hook can only be used as a \'' + type + '\' hook.');
  }

  if (!methods) {
    return;
  }

  var myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(hook.method) === -1) {
    var msg = JSON.stringify(myMethods);
    throw new Error('The \'' + label + '\' hook can only be used on the \'' + msg + '\' service method(s).');
  }
}

/**
 * Return the data items in a hook.
 * hook.data if type=before.
 * hook.result.data if type=after, method=find with pagination.
 * hook.result otherwise if type=after.
 *
 * @param {Object} hook - The hook.
 * @returns {Object|Array.<Object>} The data item or array of data items
 */
function getItems(hook) {
  var items = hook.type === 'before' ? hook.data : hook.result;
  return items && hook.method === 'find' ? items.data || items : items;
}

/**
 * Replace the data items in a hook. Companion to getItems.
 *
 * @param {Object} hook - The hook.
 * @param {Object|Array.<Object>} items - The data item or array of data items
 *
 * If you update an after find paginated hook with an item rather than an array of items,
 * the hook will have an array consisting of that one item.
 */
function replaceItems(hook, items) {
  if (hook.type === 'before') {
    hook.data = items;
  } else if (hook.method === 'find' && hook.result && hook.result.data) {
    if (Array.isArray(items)) {
      hook.result.data = items;
      hook.result.total = items.length;
    } else {
      hook.result.data = [items];
      hook.result.total = 1;
    }
  } else {
    hook.result = items;
  }
}