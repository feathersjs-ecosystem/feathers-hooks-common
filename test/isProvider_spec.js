
/* eslint no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib/index');

var hookServer;
var hookSocketio;

describe('isProvider', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
  });

  it('returns a function', () => {
    const fcn = hooks.isProvider('server');

    assert.isFunction(fcn);
  });

  it('gets passed the hook', () => {
    const hook = clone(hookServer);
    const result = hooks.isProvider('server')(hook);

    assert.equal(result, true);
  });

  it('throws on no args', () => {
    assert.throws(() => hooks.isProvider());
  });

  it('finds provider with 1 arg', () => {
    const hook = clone(hookSocketio);
    const result = hooks.isProvider('socketio')(hook);

    assert.equal(result, true);
  });

  it('finds provider with 2 args', () => {
    const hook = clone(hookSocketio);
    const result = hooks.isProvider('rest', 'socketio')(hook);

    assert.equal(result, true);
  });

  it('finds server', () => {
    const hook = clone(hookServer);
    const result = hooks.isProvider('rest', 'socketio', 'server')(hook);

    assert.equal(result, true);
  });

  it('finds external', () => {
    const hook = clone(hookSocketio);
    const result = hooks.isProvider('rest', 'server', 'external')(hook);

    assert.equal(result, true);
  });

  it('fails properly if not provider', () => {
    const hook = clone(hookServer);
    const result = hooks.isProvider('socketio')(hook);

    assert.equal(result, false);
  });

  it('fails properly if not external', () => {
    const hook = clone(hookServer);
    const result = hooks.isProvider('external')(hook);

    assert.equal(result, false);
  });

  it('fails properly if not server', () => {
    const hook = clone(hookSocketio);
    const result = hooks.isProvider('server')(hook);

    assert.equal(result, false);
  });
});

// Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
