
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'alterItems... Remove this comment to see the full error message
const { alterItems } = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFindPa... Remove this comment to see the full error message
let hookFindPaginate: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFind'.
let hookFind: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services alterItems', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { first: 'John', last: 'Doe' }
    };
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane', last: 'Doe' }
    };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
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
      params: { provider: 'rest' },
      result: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('default func is a no-op', () => {
    alterItems()(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('context is 2nd param', () => {
    let contextParam;
    alterItems((rec: any, context: any) => { contextParam = context; })(hookBefore);
    assert.deepEqual(contextParam, hookBefore);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if 1st param is not a func', () => {
    try {
      alterItems('no-func');
    } catch (error) {
      assert.equal(error.message, 'Function required. (alter)');
      return;
    }
    throw new Error('alterItems does not throw an error if 1st param is not a function');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook before::create', () => {
    alterItems((rec: any) => { rec.state = 'UT'; })(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with pagination', () => {
    alterItems((rec: any) => { delete rec.last; })(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [
      { first: 'John' },
      { first: 'Jane' }
    ]);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with no pagination', () => {
    alterItems((rec: any) => { rec.new = rec.first; })(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' }
    ]);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after', () => {
    alterItems((rec: any) => { rec.new = rec.first; })(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook before::create with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { state: 'UT' }))(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with pagination with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, { first: rec.first }))(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [
      { first: 'John' },
      { first: 'Jane' }
    ]);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with pagination with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' }
    ]);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns a promise that contains context', () => {
    return alterItems((rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();
    })(hookBefore).then((context: any) => {
      assert.deepEqual(context, hookBefore);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook before::create with new item returned', () => {
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' })))(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook before::create async', () => {
    const alterFunc = (rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();
    };
    return alterItems(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook before::create async with new item returned', () => {
    const alterFunc = (rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' }));
    return alterItems(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::create', () => {
    return alterItems((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
    })(hookAfter).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::create with new item returned', () => {
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(hookAfter).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with pagination', () => {
    return alterItems((rec: any) => {
      delete rec.last;
      return Promise.resolve();
    })(hookFindPaginate).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with no pagination', () => {
    return alterItems((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
    })(hookFind).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' }
      ]);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with pagination with new item returned', () => {
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, { first: rec.first })))(hookFindPaginate).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates hook after::find with no pagination with new item returned', () => {
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(hookFind).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' }
      ]);
    });
  });
});
