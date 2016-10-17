
/* eslint  no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib');

var hookBefore;
var hookBefore2;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('setCreatedAt', () => {
  describe('no dynamic decision', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        result: {
          total: 2,
          data: [
            { first: 'John', last: 'Doe' },
            { first: 'Jane', last: 'Doe' }
          ]
        } };
      hookFind = {
        type: 'after',
        method: 'find',
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' }
        ]
      };
    });

    it('updates hook before::create', () => {
      hooks.setCreatedAt()(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after::find with pagination', () => {
      hooks.setCreatedAt()(hookFindPaginate);

      checkHook(hookFindPaginate.result.data[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFindPaginate.result.data[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after::find with no pagination', () => {
      hooks.setCreatedAt()(hookFind);
      checkHook(hookFind.result[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFind.result[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after', () => {
      hooks.setCreatedAt()(hookAfter);
      checkHook(hookAfter.result, { first: 'Jane', last: 'Doe' }, 'createdAt');
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      };
      hookBefore2 = {
        type: 'before',
        method: 'create',
        data: {
          empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
          dept: 'Acct',
          created: { where: 'NYC' }
        }
      };
    });

    it('prop with no dots', () => {
      hooks.setCreatedAt('madeAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , 'madeAt');
    });

    it('props with no dots', () => {
      hooks.setCreatedAt('madeAt', 'builtAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , ['madeAt', 'builtAt']);
    });

    it('prop with 1 dot', () => {
      hooks.setCreatedAt('created.at')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot in existing obj', () => {
      hooks.setCreatedAt('created.at')(hookBefore2);
      assert.instanceOf(hookBefore2.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore2.data.created).length, 2);
      delete hookBefore2.data.created.at;
      assert.deepEqual(hookBefore2.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
          dept: 'Acct',
          created: { where: 'NYC' }
        }
      );
    });

    it('prop with 2 dots', () => {
      hooks.setCreatedAt('created.at.time')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at.time, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created.at).length, 1);
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });

  describe('dynamic decision sync', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true, no field name', () => {
      hooks.setCreatedAt(() => true)(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
    });

    it('updates when true, with field name', () => {
      hooks.setCreatedAt('madeAt', () => true)(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'madeAt');
    });

    it('does not update when false', () => {
      hooks.setCreatedAt(() => false)(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
    });
  });
  describe('dynamic decision with Promise', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true, no field name', (next) => {
      hooks.setCreatedAt(
        () => new Promise(resolve => resolve(true))
        )(hookBefore)
        .then(() => {
          checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
          next();
        });
    });

    it('updates when true, with field name', (next) => {
      hooks.setCreatedAt('madeAt',
        () => new Promise(resolve => resolve(true))
        )(hookBefore)
        .then(() => {
          checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'madeAt');
          next();
        });
    });

    it('does not update when false', (next) => {
      hooks.setCreatedAt(
        () => new Promise(resolve => resolve(false))
        )(hookBefore)
        .then(() => {
          assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
          next();
        });
    });
  });
});

// Helpers

function checkHook (item, template, dateFields) {
  const item1 = clone(item);
  if (typeof dateFields === 'string') {
    dateFields = [dateFields];
  }

  dateFields.forEach(dateField => {
    assert.instanceOf(item[dateField], Date, 'not instance of Date');
    item1[dateField] = undefined;
    delete item1[dateField];
  });

  assert.deepEqual(item1, template, 'objects differ');
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
