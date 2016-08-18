'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var setByDot = exports.setByDot = function setByDot(obj, path, value, ifDelete) {
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
};