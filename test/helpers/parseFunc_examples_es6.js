
/* eslint no-unused-vars: 0 */

// Convert some ES6 function signatures to ES5 with Babel

const qqq = 5;

// function abc1(a, b, c) {}
function abc1(a, b, c) {}

// function abc2(a, b = 1, c = () => {}) {}
function abc2(a, b = 1, c = () => {}) {}

// const abc3 = (a, b = 5 * (qqq + 1), c) => {};
const abc3 = (a, b = 5 * (qqq + 1), c) => {};

// const abc4 = (a, b = 1, c = (x, y) => {}) => {};
const abc4 = (a, b = 1, c = (x, y) => {}) => {};

export { abc1, abc2, abc3, abc4 };
