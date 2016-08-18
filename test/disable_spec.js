
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib/index');

var hookRest;
var hookSocketio;
var hookServer;

describe('disable', () => {
  describe('no dynamic decision', () => {
    beforeEach(() => {
      hookRest = { method: 'create', params: { provider: 'rest' } };
      hookSocketio = { method: 'create', params: { provider: 'socketio' } };
      hookServer = { method: 'create', params: { provider: '' } };
    });

    it('disables all providers with no param', () => {
      assert.throws(() => { hooks.disable()(hookSocketio); });
      assert.throws(() => { hooks.disable()(hookServer); });
    });

    it('disables all providers with null', () => {
      assert.throws(() => { hooks.disable(null)(hookSocketio); });
      assert.throws(() => { hooks.disable()(hookServer); });
    });

    it('disables all providers with undefined', () => {
      assert.throws(() => { hooks.disable(undefined)(hookSocketio); });
      assert.throws(() => { hooks.disable()(hookServer); });
    });

    it('disables a provider', () => {
      assert.throws(() => { hooks.disable('socketio')(hookSocketio); });
    });

    it('does not disable the server', () => {
      hooks.disable('socketio')(hookServer);
      assert.throws(() => { hooks.disable('socketio')(hookSocketio); });
    });

    it('does not disable another provider', () => {
      hooks.disable('socketio')(hookRest);
      assert.throws(() => { hooks.disable('socketio')(hookSocketio); });
    });

    it('disables multiple providers', () => {
      hooks.disable('socketio', 'rest')(hookServer);
      assert.throws(() => { hooks.disable('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { hooks.disable('socketio', 'rest')(hookRest); });
    });

    it('"external" disables all external providers', () => {
      hooks.disable('socketio', 'rest')(hookServer);
      assert.throws(() => { hooks.disable('socketio', 'rest')(hookSocketio); });
      assert.throws(() => { hooks.disable('socketio', 'rest')(hookRest); });
    });
  });

  describe('dynamic decision sync', () => {
    beforeEach(() => {
      hookRest = { method: 'create', params: { provider: 'rest' } };
      hookSocketio = { method: 'create', params: { provider: 'socketio' } };
      hookServer = { method: 'create', params: { provider: '' } };
    });

    it('allows when true', () => {
      hooks.disable(() => true)(hookSocketio);
    });

    it('does not allow when false', () => {
      assert.throws(() => { hooks.disable(() => false)(hookSocketio); });
    });
  });

  describe('dynamic decision with Promise', () => {
    beforeEach(() => {
      hookSocketio = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('allows when true', (next) => {
      hooks.disable(
        () => new Promise(resolve => { resolve(true); })
      )(hookSocketio)
        .then(() => { next(); });
    });

    it('does not allow when false', (next) => {
      hooks.disable(
        () => new Promise(resolve => { resolve(false); })
        )(hookSocketio)
        .catch(() => { next(); }); // todo Note this cannot be caught with assert.thrown
    });
  });
});
