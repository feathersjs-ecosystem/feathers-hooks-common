import { assert } from 'vitest';
import { setNowData } from './set-now-data';
import { clone } from '../../common';

let hookBefore: any;
let hookBefore2: any;

describe('setNowData', () => {
  describe('updated fields', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('updates hook before::create', () => {
      setNowData('createdAt')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt');
    });

    it('supports field name', () => {
      setNowData('createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, 'createdAt2');
    });

    it('supports multiple field names', () => {
      setNowData('createdAt1', 'createdAt2')(hookBefore);
      checkHook(hookBefore.data, { first: 'John', last: 'Doe' }, ['createdAt1', 'createdAt2']);
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
      hookBefore2 = {
        type: 'before',
        method: 'create',
        data: {
          empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
          dept: 'Acct',
          created: { where: 'NYC' },
        },
      };
    });

    it('prop with no dots', () => {
      setNowData('madeAt')(hookBefore);
      checkHook(
        hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
        'madeAt',
      );
    });

    it('props with no dots', () => {
      setNowData('madeAt', 'builtAt')(hookBefore);
      checkHook(
        hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
        ['madeAt', 'builtAt'],
      );
    });

    it('prop with 1 dot', () => {
      setNowData('created.at')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('prop with 1 dot in existing obj', () => {
      setNowData('created.at')(hookBefore2);
      assert.instanceOf(hookBefore2.data.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore2.data.created).length, 2);
      delete hookBefore2.data.created.at;
      assert.deepEqual(hookBefore2.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
        created: { where: 'NYC' },
      });
    });

    it('prop with 2 dots', () => {
      setNowData('created.at.time')(hookBefore);
      assert.instanceOf(hookBefore.data.created.at.time, Date, 'not instance of Date');
      assert.equal(Object.keys(hookBefore.data.created.at).length, 1);
      assert.equal(Object.keys(hookBefore.data.created).length, 1);
      delete hookBefore.data.created;
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });
  });

  describe('time advances', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('for 2 hooks', () =>
      new Promise<void>(resolve => {
        setNowData('createdAt')(hookBefore);
        const firstTime = hookBefore.data.createdAt;

        setTimeout(() => {
          setNowData('createdAt')(hookBefore);
          assert.isAbove(hookBefore.data.createdAt.getTime(), firstTime.getTime());
          resolve();
        }, 50);
      }));
  });
});

// Helpers

function checkHook(item: any, template: any, dateFields: any) {
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
