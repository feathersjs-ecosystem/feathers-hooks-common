
/* eslint-disable */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// Convert some ES6 function signatures to ES5 with Babel

var qqq = 5;

// function abc1(a, b, c) {}
function abc1(a, b, c) {}

// function abc2(a, b = 1, c = () => {}) {}
function abc2(a) {
  var b = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var c = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];
}

// const abc3 = (a, b = 5 * (qqq + 1), c) => {};
var abc3 = function abc3(a) {
  var b = arguments.length <= 1 || arguments[1] === undefined ? 5 * (qqq + 1) : arguments[1];
  var c = arguments[2];
};

// const abc4 = (a, b = 1, c = (x, y) => {}) => {};
var abc4 = function abc4(a) {
  var b = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var c = arguments.length <= 2 || arguments[2] === undefined ? function (x, y) {} : arguments[2];
};

exports.abc1 = abc1;
exports.abc2 = abc2;
exports.abc3 = abc3;
exports.abc4 = abc4;

/* eslint-enable */
