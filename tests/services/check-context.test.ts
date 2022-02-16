
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
  checkContext
} = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services checkContext', () => {
  var hook: any; // eslint-disable-line no-var

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hook = { type: 'before', method: 'create' };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles "any" type and method', () => {
    assert.equal(checkContext(hook), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles expected type', () => {
    hook.type = 'before';
    assert.equal(checkContext(hook, 'before'), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles unexpected type', () => {
    hook.type = 'after';
    assert.throws(() => { checkContext(hook, 'before'); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles undefined type', () => {
    hook.type = 'after';
    assert.equal(checkContext(hook), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles null type', () => {
    hook.type = 'after';
    assert.equal(checkContext(hook, null), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles expected type as array', () => {
    hook.type = 'before';
    assert.equal(checkContext(hook, ['before', 'after']), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles unexpected type as array', () => {
    hook.type = 'error';
    assert.throws(() => { checkContext(hook, ['before', 'after']); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles expected method as string', () => {
    hook.method = 'create';
    assert.equal(checkContext(hook, null, 'create'), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles unexpected method as string', () => {
    hook.method = 'patch';
    assert.throws(() => { checkContext(hook, null, 'create'); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles expected method as array', () => {
    hook.method = 'create';
    assert.equal(checkContext(hook, null, ['create']), undefined);
    assert.equal(checkContext(hook, null, ['create', 'update', 'remove']), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles unexpected method as array', () => {
    hook.method = 'patch';
    assert.throws(() => { checkContext(hook, null, ['create']); });
    assert.throws(() => { checkContext(hook, null, ['create', 'update', 'remove']); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles undefined method', () => {
    hook.method = 'patch';
    assert.equal(checkContext(hook, null), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles null method', () => {
    hook.method = 'patch';
    assert.equal(checkContext(hook, null, null), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles expected type and method as array', () => {
    hook.type = 'before';
    hook.method = 'create';
    assert.equal(checkContext(hook, 'before', ['create']), undefined);
    assert.equal(checkContext(hook, 'before', ['create', 'update', 'remove']), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('allows custom methods', () => {
    hook.type = 'before';
    hook.method = 'custom';
    assert.equal(checkContext(hook, 'before', ['create']), undefined);
    assert.equal(checkContext(hook, 'before', ['create', 'update', 'remove']), undefined);
  });
});
