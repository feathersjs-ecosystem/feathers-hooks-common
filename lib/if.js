'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* eslint no-param-reassign: 0, no-unused-vars: 0, no-var: 0 */

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
  } // need to clone
  if (!Array.isArray(value)) {
    value = [value];
  } // need to clone

  return !field.some(function (elem) {
    return value.indexOf(elem) === -1;
  });
};

// The hook to conditionally run another hook

var iff = exports.iff = function iff(ifFcn, hookFcn) {
  var a = 1; // do stuff
  return function (hook, next) {
    if (ifFcn(hook)) {
      // Do we want to use a clone of hook? Doubtful.
      return hookFcn(hook, next);
    }

    return hook;
  };
};

// example usage

exports.before = {
  create: [iff(ifNotExternal(), setCreatedAt()), iff(ifSome(aHook.params.provider, 'rest'), setCreatedAt())]
};