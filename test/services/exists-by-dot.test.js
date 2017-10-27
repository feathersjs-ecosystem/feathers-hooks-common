
const {
  assert
} = require('chai');

const {
  existsByDot
} = require('../../lib/services');

const objTest = { name: { first: 'John', last: 'Doe', a: { b: 1, c: { d: 2, e: {} } } } };
let obj;
let nullObj;

describe('test existsByDot', () => {
  beforeEach(() => {
    obj = clone(objTest);
    nullObj = { name: { first: null, last: undefined } }; // can't clone undefined
  });

  it('finds top level property', () => {
    assert.equal(existsByDot({}, 'a'), false, 'a');
    assert.equal(existsByDot({ a: 1 }, 'a'), true, 'b');
    assert.equal(existsByDot({ a: 1 }, 'z'), false, 'c');
    assert.equal(existsByDot({ a: 1, b: 2 }, 'a'), true, 'd');
    assert.equal(existsByDot({ a: 1, b: 2 }, 'b'), true, 'e');
    assert.equal(existsByDot({ a: 1, b: 2 }, 'z'), false, 'f');
    assert.equal(existsByDot({ a: { x: 'x' }, b: 2 }, 'a'), true, 'g');
    assert.equal(existsByDot({ a: { x: 'x' }, b: 2 }, 'b'), true, 'h');
    assert.equal(existsByDot({ a: { x: 'x' }, b: 2 }, 'z'), false, 'i');
  });

  it('finds nested leaf property', () => {
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: { d: 2, e: {} } } } }, 'name.first'), true);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: { d: 2, e: {} } } } }, 'name.last'), false);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: { d: undefined } } } }, 'name.a.c.d'), true);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: { d: 2 } } } }, 'name.a.c.e'), false);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: {} } } }, 'name.a.c'), true);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1, c: {} } } }, 'name.a.c.d'), false);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: null } } }, 'name.a.b'), true);
    assert.equal(existsByDot({ name: { first: 'John', a: { b: 1 } } }, 'name.a.c'), false);
    assert.equal(existsByDot({ name: { first: 'John' } }, 'name.a'), false);
    assert.equal(existsByDot({}, 'name'), false);
  });

  it('does not throw if path ends prematurely', () => {
    assert.deepEqual(existsByDot(obj, 'x'), false);
    assert.deepEqual(existsByDot(obj, 'name.a.c.x'), false);
  });

  it('does not throw contains non-{}', () => {
    assert.deepEqual(existsByDot(obj, 'name.a.b.x'), false);
    assert.deepEqual(existsByDot(nullObj, 'name.first.x'), false);
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
