
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services keepQuery', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('updates query', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { query: { first: 'John', last: 'Doe' } }
      };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create', () => {
      hooks.keepQuery('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John', last: 'Doe' } });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create', () => {
      hooks.keepQuery('first')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John' } });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws on hook after', () => {
      assert.throws(() => { hooks.keepQuery('last')(hookAfter); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw if field is missing', () => {
      hooks.keepQuery('x', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params.query, { last: 'Doe' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles dot notation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: {
          query: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct', 'owner.id': 1, 'owner.admin': false }
        }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with no dots', () => {
      hooks.keepQuery('empl')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 1 dot', () => {
      hooks.keepQuery('empl.name', 'dept', 'owner.id', 'owner.admin')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct', 'owner.id': 1, 'owner.admin': false }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 2 dots', () => {
      hooks.keepQuery('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing paths', () => {
      hooks.keepQuery('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        {}
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing no dot path', () => {
      hooks.keepQuery('xx')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        {}
      );
    });
  });
});
