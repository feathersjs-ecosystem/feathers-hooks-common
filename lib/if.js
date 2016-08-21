'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* eslint arrow-body-style: 0, consistent-return: 0, no-param-reassign: 0,
no-unused-vars: 0, no-var: 0 */

var aHook = {};
function setCreatedAt() {}

// fcns checking conditions

var ifNotExternal = function ifNotExternal() {
  // custom
  var a = 1; // do stuff
  return function (hook) {
    var b = 1; // do stuff
    return !!hook.params.provider;
  };
};

// field  constants
// value1 value2  value1 === value2     ? === or ==
// value  array   array.indexOf(value)
// array  value   array.indexOf(value)
// array1 array2  array1.some(elem => array2.indexOf(elem) !== -1)  ? is this what we want

var ifSome = function ifSome(field, value) {
  // keep as generic?
  if (!Array.isArray(field)) {
    field = [field];
  }
  if (!Array.isArray(value)) {
    value = [value];
  }

  return !field.some(function (elem) {
    return value.indexOf(elem) === -1;
  });
};

// ===> The hook to conditionally run another hook <===

var iff = exports.iff = function iff(ifFcn, hookFcn) {
  var a = 1; // do stuff
  return function (hook, next) {
    var check = ifFcn(hook);

    if ((typeof check === 'undefined' ? 'undefined' : _typeof(check)) === 'object' && typeof check.then === 'function') {
      check.then(function (check1) {
        return check1 ? hookFcn(hook) : Promise.resolve(hook);
      });
    } else if (check) {
      return hookFcn(hook, next);
    }
  };
};

// example usage

exports.before = {
  create: [iff(ifNotExternal(), setCreatedAt()), iff(ifSome(aHook.params.provider, 'rest'), setCreatedAt())]
};