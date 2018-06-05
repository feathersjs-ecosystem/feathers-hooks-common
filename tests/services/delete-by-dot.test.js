
const {
  assert
} = require('chai');

const {
  deleteByDot
} = require('../../lib/services');

const objTest = { name: { first: 'John', last: 'Doe', a: { b: 1, c: { d: 2, e: {} } } } };
let obj;
let nullObj;

describe('test deleteByDot', () => {
  beforeEach(() => {
    obj = clone(objTest);
    nullObj = { name: { first: null, last: undefined } }; // can't clone undefined
  });

  it('deletes top level property', () => {
    let obj1 = {};
    deleteByDot(obj1, 'x');
    assert.deepEqual(obj1, {});
    obj1 = { a: 1 };
    deleteByDot(obj1, 'x');
    assert.deepEqual(obj1, { a: 1 });
    obj1 = { a: 1 };
    deleteByDot(obj1, 'a');
    assert.deepEqual(obj1, {});
    obj1 = { a: 1, b: 2 };
    deleteByDot(obj1, 'a');
    assert.deepEqual(obj1, { b: 2 });
    obj1 = { a: { x: 'x' }, b: 2 };
    deleteByDot(obj1, 'a');
    assert.deepEqual(obj1, { b: 2 });
  });

  it('deletes nested leaf property', () => {
    deleteByDot(obj, 'name.last');
    assert.deepEqual(obj, { name: { first: 'John', a: { b: 1, c: { d: 2, e: {} } } } });
    deleteByDot(obj, 'name.a.c.e');
    assert.deepEqual(obj, { name: { first: 'John', a: { b: 1, c: { d: 2 } } } });
    deleteByDot(obj, 'name.a.c.d');
    assert.deepEqual(obj, { name: { first: 'John', a: { b: 1, c: {} } } });
    deleteByDot(obj, 'name.a.c');
    assert.deepEqual(obj, { name: { first: 'John', a: { b: 1 } } });
    deleteByDot(obj, 'name.a');
    assert.deepEqual(obj, { name: { first: 'John' } });
    deleteByDot(obj, 'name');
    assert.deepEqual(obj, {});
  });

  it('delete an array item', () => {
    let obj1 = {arr: ['a', 'b', 'c']};
    deleteByDot(obj1, 'arr.1');
    assert.equal(obj1.arr[1], 'c');
    assert.equal(obj1.arr.length, 2);
  });

  it('does not throw if path ends prematurely', () => {
    deleteByDot(obj, 'x');
    assert.deepEqual(obj, objTest, '1');
    deleteByDot(obj, 'name.a.c.x');
    assert.deepEqual(obj, objTest, '2');
  });

  it('throws if path contains non-{}', () => {
    assert.throws(() => { deleteByDot(obj, 'name.a.b.x'); });
    assert.throws(() => { deleteByDot(nullObj, 'name.first.x'); });
    assert.throws(() => { deleteByDot(nullObj, 'name.last.x'); });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
