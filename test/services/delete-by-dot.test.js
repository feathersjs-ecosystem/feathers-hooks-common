
import { assert } from 'chai';
import { deleteByDot } from '../../src/services';

const objTest = { name: { first: 'John', last: 'Doe', a: { b: 1, c: { d: 2, e: {} } } } };
const nullTest = { name: { first: null, last: undefined } };
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
  
  it('leaves obj unchanged if path invalid', () => {
    deleteByDot(obj, 'a.c.d');
    assert.deepEqual(obj, objTest, '1');
    deleteByDot(obj, 'name.a.b.c.d');
    assert.deepEqual(obj, objTest, '2');
    deleteByDot(obj, 'name.a.c.e.f');
    assert.deepEqual(obj, objTest, '3');
  });
  
  it('handles null & undefined values', () => {
    deleteByDot(nullObj, 'name.first.a');
    assert.deepEqual(nullObj, nullTest, '1');
    deleteByDot(nullObj, 'name.last.a');
    assert.deepEqual(nullObj, nullTest, '1');
  });
});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}