
/* eslint no-console: 0, no-param-reassign: 0, no-shadow: 0, no-unused-vars: 0, no-var: 0,
prefer-arrow-callback
: 0 */

// These tests will help identify when getParameterNames has fixed some bugs
// We also test named parameter defaults that Babel allows which may not be allowed in ES6

const assert = require('chai').assert;
const getParameterNames = require('../lib/promisify').getParameterNames;

describe('getParameterNames bugs', () => {
  it('b = () => {}', () => {
    const varNames = getParameterNames(function abc(a, b = () => {}, c) {});
    console.log(varNames);
    assert.deepEqual(varNames, ['a', 'b']); // s/b 'a', 'b', 'c'
  });

  it('b = (x, y) => {}', () => {
    const varNames = getParameterNames(function abc(a, b = (x, y) => {}, c) {});
    console.log(varNames);
    assert.deepEqual(varNames, ['a', 'b', 'y']); // s/b 'a', 'b', 'c'
  });

  it('b = \'x,y\'.indexOf(\'y\')', () => {
    const varNames = getParameterNames(function abc(a, b = 5 * (1 + 2), c) {});
    console.log(varNames);
    assert.deepEqual(varNames, ['a', 'b', 'c']); // correct
  });

  it('b = 5 * ( 1 + 2)', () => {
    const varNames = getParameterNames(function abc(a, b = 'x,y'.indexOf('y'), c) {});
    console.log(varNames);
    assert.deepEqual(varNames, ['a', 'b', 'y\'.indexOf(\'y\'']); // s/b 'a', 'b', 'c'
  });
});
