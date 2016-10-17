
/* eslint-env es6, node */
/* eslint no-var: 0 */

const assert = require('chai').assert;
const utils = require('../lib/utils');

const getByDot = utils.getByDot;
const setByDot = utils.setByDot;


describe('byDot', () => {
  var obj;
  var empty;

  describe('test getByDot', () => {
    beforeEach(() => {
      obj = {
        dept: 'acct', manager: {
          ref: 'acct-mgr', employee: {
            name: 'John',
            address: { line1: '100 5-th Avenue', city: 'New York' },
          },
        },
      };
    });

    it('gets top level simple variable', () => {
      assert.equal(getByDot(obj, 'dept'), obj.dept);
    });

    it('gets top level object', () => {
      assert.equal(getByDot(obj, 'manager'), obj.manager);
    });

    it('gets mid level simple variable', () => {
      assert.equal(getByDot(obj, 'manager.ref'), obj.manager.ref);
    });

    it('gets mid level object', () => {
      assert.equal(getByDot(obj, 'manager.employee'), obj.manager.employee);
    });

    it('gets leaf level simple variable', () => {
      assert.equal(getByDot(obj, 'manager.employee.address.city'),
        obj.manager.employee.address.city);
    });

    it('does not throw on missing path, at top', () => {
      assert.equal(getByDot(obj, 'xxx'), undefined);
    });

    it('does not throw on missing path, in mid level', () => {
      assert.equal(getByDot(obj, 'manager.employee.xxx.city'), undefined);
    });

    it('does not throw on missing path, at leaf', () => {
      assert.equal(getByDot(obj, 'manager.employee.address.xxx'), undefined);
    });
  });

  describe('test setByDot', () => {
    beforeEach(() => {
      empty = {};
      obj = { name: { first: 'John', last: 'Doe' } };
    });

    it('sets new top level value', () => {
      setByDot(empty, 'x', 1);
      assert.deepEqual(empty, { x: 1 });
      setByDot(empty, 'a', '1');
      assert.deepEqual(empty, { a: '1', x: 1 });
      setByDot(empty, 'a', null);
      assert.deepEqual(empty, { a: null, x: 1 });
      setByDot(empty, 'a', undefined);
      assert.deepEqual(empty, { a: undefined, x: 1 });
      setByDot(empty, 'a', { b: 2 });
      assert.deepEqual(empty, { a: { b: 2 }, x: 1 });
      const fcn = () => true;
      setByDot(empty, 'a', fcn);
      assert.deepEqual(empty, { a: fcn, x: 1 });
    });

    it('sets new inner level value', () => {
      setByDot(empty, 'a.b1', 1);
      assert.deepEqual(empty, { a: { b1: 1 } }, 'a.b2.c1');
      setByDot(empty, 'a.b2.c1', undefined);
      assert.deepEqual(empty, { a: { b1: 1, b2: { c1: undefined } } }, 'a.b2.c1');
      const fcn = () => true;
      setByDot(empty, 'a.b2.c2', fcn);
      assert.deepEqual(empty, { a: { b1: 1, b2: { c1: undefined, c2: fcn } } }, 'a.b2.c2');
    });

    it('overwrites previous value', () => {
      setByDot(obj, 'name.first', 'Jane');
      assert.deepEqual(obj, { name: { first: 'Jane', last: 'Doe' } });
      setByDot(obj, 'name', { firstest: 'Donald', lastest: 'Duck' });
      assert.deepEqual(obj, { name: { firstest: 'Donald', lastest: 'Duck' } });
    });

    it('deletes undefined values', () => {
      setByDot(obj, 'name.first', undefined, true);
      assert.deepEqual(obj, { name: { last: 'Doe' } });
      setByDot(obj, 'name', undefined, true);
      assert.deepEqual(obj, {});
    });
  });
});
