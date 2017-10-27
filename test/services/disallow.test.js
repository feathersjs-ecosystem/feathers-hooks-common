const {
  assert
} = require('chai');

const {
  disallow
} = require('../../lib/services');

describe('services disallow', () => {
  describe('disallow is compatible with .disable (without predicate)', () => {
    let hookRest;
    let hookSocketio;
    let hookServer;

    beforeEach(() => {
      hookRest = { method: 'create', params: { provider: 'rest' } };
      hookSocketio = { method: 'create', params: { provider: 'socketio' } };
      hookServer = { method: 'create', params: { provider: '' } };
    });

    it('disables all providers with no param', () => {
      assert.throws(() => { disallow()(hookSocketio); });
      assert.throws(() => { disallow()(hookServer); });
    });

    it('disables a provider', () => {
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    it('does not disable the server', () => {
      disallow('socketio')(hookServer);
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    it('does not disable another provider', () => {
      disallow('socketio')(hookRest);
      assert.throws(() => { disallow('socketio')(hookSocketio); });
    });

    it('disables multiple providers', () => {
      disallow('socketio', 'rest')(hookServer);
      assert.throws(() => { disallow('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { disallow('socketio', 'rest')(hookRest); });
    });

    it('"external" disables all external providers', () => {
      disallow('socketio', 'rest')(hookServer);
      assert.throws(() => { disallow('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { disallow('socketio', 'rest')(hookRest); });
    });
  });

  describe('disallow functionality is like isProvider', () => {
    let hookServer;
    let hookSocketio;
    let hook;

    beforeEach(() => {
      hookServer = { type: 'before', method: 'create', params: { provider: '' } };
      hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
    });

    it('returns a function', () => {
      const fcn = disallow('server');

      assert.isFunction(fcn);
    });

    it('throws on no args', () => {
      assert.throws(() => disallow()(hook));
    });

    it('finds provider with 1 arg', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('socketio')(hook); });
    });

    it('finds provider with 2 args', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest', 'server')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'socketio')(hook); });
    });

    it('finds server', () => {
      const hook = clone(hookServer);

      const result = disallow('rest', 'socketio', 'external')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'socketio', 'server')(hook); });
    });

    it('finds external', () => {
      const hook = clone(hookSocketio);

      const result = disallow('rest', 'server')(hook);
      assert.equal(result, undefined);

      assert.throws(() => { disallow('rest', 'server', 'external')(hook); });
    });

    it('succeeds if not provider', () => {
      const hook = clone(hookServer);

      const result = disallow('socketio')(hook);
      assert.equal(result, undefined);
    });

    it('succeeds if not external', () => {
      const hook = clone(hookServer);

      const result = disallow('external')(hook);
      assert.equal(result, undefined);
    });

    it('succeeds if not server', () => {
      const hook = clone(hookSocketio);

      const result = disallow('server')(hook);
      assert.equal(result, undefined);
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
