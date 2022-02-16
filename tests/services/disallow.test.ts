const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'disallow'.
  disallow
} = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services disallow', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('disallow is compatible with .disable (without predicate)', () => {
    let hookRest: any;
    let hookSocketio: any;
    let hookServer: any;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookRest = { method: 'create', params: { provider: 'rest' } };
      hookSocketio = { method: 'create', params: { provider: 'socketio' } };
      hookServer = { method: 'create', params: { provider: '' } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disables all providers with no param', () => {
      assert.throws(() => { disallow()(hookSocketio); });
      assert.throws(() => { disallow()(hookServer); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disables a provider', () => {
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not disable the server', () => {
      disallow('socketio')(hookServer);
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not disable another provider', () => {
      disallow('socketio')(hookRest);
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disables multiple providers', () => {
      disallow('socketio', 'rest')(hookServer);
      assert.throws(() => { disallow('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { disallow('socketio', 'rest')(hookRest); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('"external" disables all external providers', () => {
      disallow('socketio', 'rest')(hookServer);
      assert.throws(() => { disallow('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { disallow('socketio', 'rest')(hookRest); });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('disallow functionality is like isProvider', () => {
    let hookServer: any;
    let hookSocketio: any;
    let hook: any;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookServer = { type: 'before', method: 'create', params: { provider: '' } };
      hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns a function', () => {
      const fcn = disallow('server');

      assert.isFunction(fcn);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws on no args', () => {
      assert.throws(() => disallow()(hook));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finds provider with 1 arg', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('socketio')(hook); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finds provider with 2 args', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest', 'server')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'socketio')(hook); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finds server', () => {
      const hook = clone(hookServer);

      const result = disallow('rest', 'socketio', 'external')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'socketio', 'server')(hook); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finds external', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest', 'server')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'server', 'external')(hook); });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('succeeds if not provider', () => {
      const hook = clone(hookServer);

      const result = disallow('socketio')(hook);
      assert.equal(result, undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('succeeds if not external', () => {
      const hook = clone(hookServer);

      const result = disallow('external')(hook);
      assert.equal(result, undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('succeeds if not server', () => {
      const hook = clone(hookSocketio);

      const result = disallow('server')(hook);
      assert.equal(result, undefined);
    });
  });
});

// Helpers

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
