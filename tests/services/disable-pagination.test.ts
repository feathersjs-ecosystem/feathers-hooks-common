
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'disablePag... Remove this comment to see the full error message
const { disablePagination } = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services disablePagination', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'find',
      params: { query: { id: 1, $limit: -1 } }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('disables on $limit = -1', () => {
    hookBefore.params.query.$limit = -1;

    const result = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('disables on $limit = "-1"', () => {
    hookBefore.params.query.$limit = '-1';

    const result = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if after hook', () => {
    hookBefore.type = 'after';

    assert.throws(() => { disablePagination()(hookBefore); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if not find', () => {
    hookBefore.method = 'get';

    assert.throws(() => { disablePagination()(hookBefore); });
  });
});
