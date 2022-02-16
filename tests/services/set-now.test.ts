
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

let hookBefore;
let hookBefore2;
let hookAfter;
let hookFindPaginate;
let hookFind;

describe('services setNow', () => {
  describe('updated fields', () => {
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
        }
      };
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
      hooks.setNow('createdAt')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after::find with pagination', () => {
      hooks.setNow('createdAt')(hookFindPaginate);

      checkHook(hookFindPaginate.result.data[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFindPaginate.result.data[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after::find with no pagination', () => {
      hooks.setNow('createdAt')(hookFind);
      checkHook(hookFind.result[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFind.result[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after', () => {
      hooks.setNow('createdAt')(hookAfter);
      checkHook(hookAfter.result, { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('supports field name', () => {
      hooks.setNow('createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt2');
    });

    it('supports multiple field names', () => {
      hooks.setNow('createdAt1', 'createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, ['createdAt1', 'createdAt2']);
    });

    it('requires field name', () => {
      assert.throws(() => {
        hooks.setNow()(hookBefore);
      });
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
      hooks.setNow('madeAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , 'madeAt');
    });

    it('props with no dots', () => {
      hooks.setNow('madeAt', 'builtAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , ['madeAt', 'builtAt']);
    });

    it('prop with 1 dot', () => {
      hooks.setNow('created.at')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot in existing obj', () => {
      hooks.setNow('created.at')(hookBefore2);
      assert.instanceOf(hookBefore2.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore2.data.created).length, 2);
      delete hookBefore2.data.created.at;
      assert.deepEqual(hookBefore2.data,
        {
          empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
          dept: 'Acct',
          created: { where: 'NYC' }
        }
      );
    });

    it('prop with 2 dots', () => {
      hooks.setNow('created.at.time')(hookBefore);
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
      hooks.setNow('createdAt')(hookBefore);
      const firstTime = hookBefore.data.createdAt;

      setTimeout(() => {
        hooks.setNow('createdAt')(hookBefore);
        assert.isAbove(hookBefore.data.createdAt.getTime(), firstTime.getTime());
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
