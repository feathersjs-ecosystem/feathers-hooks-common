
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'makeCallin... Remove this comment to see the full error message
const { makeCallingParams } = require('../../lib');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'context'.
let context: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('service calling-params-2.test.js', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    context = { query: { aaa: 'bbb' }, params: { foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('retains default context', () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
    const res = makeCallingParams(context);
    assert.deepEqual(res, { _populate: 'skip', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets query', () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 2.
    const res = makeCallingParams(context, { a: 1 });
    assert.deepEqual(res, { query: { a: 1 }, _populate: 'skip', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets include string', () => {
    const res = makeCallingParams(context, null, 'foo');
    assert.deepEqual(res, { foo: 'bar', _populate: 'skip' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets include array', () => {
    const res = makeCallingParams(context, null, ['foo', 'baz']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets include skip missing names', () => {
    const res = makeCallingParams(context, null, ['foo', 'baz', 'x']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('injects', () => {
    const res = makeCallingParams(context, null, null, { aa: 2 });
    assert.deepEqual(res, { aa: 2, _populate: 'skip' });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('injects overwrites _populate', () => {
    const res = makeCallingParams(context, null, null, { _populate: false });
    assert.deepEqual(res, { _populate: false });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('all work together', () => {
    const res = makeCallingParams(context, { a: 1 }, ['foo', 'baz', 'x'], { aa: 2 });
    assert.deepEqual(res, { query: { a: 1 }, foo: 'bar', baz: 'faz', aa: 2, _populate: 'skip' });
  });
});
