
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
let hookBefore2: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFindPa... Remove this comment to see the full error message
let hookFindPaginate;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFind'.
let hookFind;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services setNow', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('updated fields', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create', () => {
      hooks.setNow('createdAt')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find with pagination', () => {
      hooks.setNow('createdAt')(hookFindPaginate);

      checkHook(hookFindPaginate.result.data[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFindPaginate.result.data[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find with no pagination', () => {
      hooks.setNow('createdAt')(hookFind);
      checkHook(hookFind.result[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFind.result[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after', () => {
      hooks.setNow('createdAt')(hookAfter);
      checkHook(hookAfter.result, { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('supports field name', () => {
      hooks.setNow('createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('supports multiple field names', () => {
      hooks.setNow('createdAt1', 'createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, ['createdAt1', 'createdAt2']);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('requires field name', () => {
      assert.throws(() => {
        hooks.setNow()(hookBefore);
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles dot notation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with no dots', () => {
      hooks.setNow('madeAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , 'madeAt');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('props with no dots', () => {
      hooks.setNow('madeAt', 'builtAt')(hookBefore);
      checkHook(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , ['madeAt', 'builtAt']);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 1 dot', () => {
      hooks.setNow('created.at')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('time advances', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('for 2 hooks', (next: any) => {
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

function checkHook (item: any, template: any, dateFields: any) {
  const item1 = clone(item);
  if (typeof dateFields === 'string') {
    dateFields = [dateFields];
  }

  dateFields.forEach((dateField: any) => {
    assert.instanceOf(item[dateField], Date, 'not instance of Date');
    item1[dateField] = undefined;
    delete item1[dateField];
  });

  assert.deepEqual(item1, template, 'objects differ');
}

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
