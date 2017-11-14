
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

var hookBefore;
var hookBefore2;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('services setUpdatedAt', () => {
  describe('updates fields', () => {
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
      hooks.setUpdatedAt()(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'updatedAt');
    });

    it('updates hook after::find with pagination', () => {
      hooks.setUpdatedAt()(hookFindPaginate);
      checkHook(hookFindPaginate.result.data[0], { first: 'John', last: 'Doe' }, 'updatedAt');
      checkHook(hookFindPaginate.result.data[1], { first: 'Jane', last: 'Doe' }, 'updatedAt');
    });

    it('updates hook after::find with no pagination', () => {
      hooks.setUpdatedAt()(hookFind);
      checkHook(hookFind.result[0], { first: 'John', last: 'Doe' }, 'updatedAt');
      checkHook(hookFind.result[1], { first: 'Jane', last: 'Doe' }, 'updatedAt');
    });

    it('updates hook after', () => {
      hooks.setUpdatedAt()(hookAfter);
      checkHook(hookAfter.result, { first: 'Jane', last: 'Doe' }, 'updatedAt');
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
      hooks.setUpdatedAt('madeAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , 'madeAt');
    });

    it('props with no dots', () => {
      hooks.setUpdatedAt('madeAt', 'builtAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , ['madeAt', 'builtAt']);
    });

    it('prop with 1 dot', () => {
      hooks.setUpdatedAt('created.at')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot in existing obj', () => {
      hooks.setUpdatedAt('created.at')(hookBefore2);
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
      hooks.setUpdatedAt('created.at.time')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at.time, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created.at).length, 1);
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });

  describe('time advances', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('for 2 hooks', next => {
      hooks.setUpdatedAt()(hookBefore);
      const firstTime = hookBefore.data.updatedAt;

      setTimeout(() => {
        hooks.setUpdatedAt()(hookBefore);
        assert.isAbove(hookBefore.data.updatedAt.getTime(), firstTime.getTime());
        next();
      }, 50);
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
