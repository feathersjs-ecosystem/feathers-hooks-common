
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('assert').strict;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'populate'.
const { populate } = require('../../lib/services/index');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services populate - finds items in hook', () => {
  let hookAfter: any;
  let hookAfterArray: any;
  let hookFindPaginate: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane2', last: 'Doe2' }
    };
    hookAfterArray = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: [{ first: 'John2', last: 'Doe2' }, { first: 'Jane', last: 'Doe' }]
    };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: {
        total: 2,
        data: [
          { first: 'John3', last: 'Doe3' },
          { first: 'Jane3', last: 'Doe3' }
        ]
      }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('one item', () => {
    const hook = clone(hookAfter);
    return populate({ schema: {} })(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('item array', () => {
    const hook = clone(hookAfterArray);
    return populate({ schema: {} })(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfterArray);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('find paginated', () => {
    const hook = clone(hookFindPaginate);
    return populate({ schema: {} })(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookFindPaginate);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services populate - throws on bad params', () => { // run to increase code climate score
  let hookAfter: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane2', last: 'Doe2' }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('schema', () => {
    assert.throws(() => { populate({}); });
    assert.throws(() => { populate({ schema: 1 }); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('permissions not func', () => {
    const hook = clone(hookAfter);
    return populate({ schema: {}, checkPermissions: 1 })(hook)
      .then(() => { throw new Error('was not supposed to succeed'); })
      .catch((err: any) => { assert.notEqual(err, undefined); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws on invalid permissions', () => {
    const hook = clone(hookAfter);
    return populate({ schema: {}, checkPermissions: () => false })(hook)
      .then(() => { throw new Error('was not supposed to succeed'); })
      .catch((err: any) => { assert.notEqual(err, undefined); });
  });
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
