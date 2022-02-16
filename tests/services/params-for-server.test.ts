
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'paramsForS... Remove this comment to see the full error message
  paramsForServer
} = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services paramsToServer', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles empty params', () => {
    const res = paramsForServer();
    assert.deepEqual(res, { query: { $client: {} } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles params with query only', () => {
    const res = paramsForServer({ query: { x: 'x', y: 1 } });
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: {} } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('copies all params without query', () => {
    const res = paramsForServer({ a: 'a', b: 1 });
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('copies all params with query', () => {
    const res = paramsForServer({ query: { x: 'x', y: 1 }, a: 'a', b: 1 });
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: { a: 'a', b: 1 } } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('copies whitelist props', () => {
    const res = paramsForServer({ a: 'a', b: 1 }, 'a', 'b');
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('ignores non whitelist props', () => {
    const res = paramsForServer({ a: 'a', b: 1 }, 'b');
    assert.deepEqual(res, { query: { $client: { b: 1 } } });
  });
});
