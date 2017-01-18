
// test disableMethod work like isProvider does
import { assert } from 'chai';
import { disableMethod } from '../../src/services';

let hookServer;
let hookSocketio;
let hook;

describe('services disableMethod-2', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
  });

  it('returns a function', () => {
    const fcn = disableMethod('server');

    assert.isFunction(fcn);
  });

  it('throws on no args', () => {
    assert.throws(() => disableMethod()(hook));
  });

  it('finds provider with 1 arg', () => {
    const hook = clone(hookSocketio);

    const result = disableMethod('rest')(hook);
    assert.equal(result, undefined);

    assert.throws(() => { disableMethod('socketio')(hook); });
  });

  it('finds provider with 2 args', () => {
    const hook = clone(hookSocketio);

    const result = disableMethod('rest', 'server')(hook);
    assert.equal(result, undefined);

    assert.throws(() => { disableMethod('rest', 'socketio')(hook); });
  });

  it('finds server', () => {
    const hook = clone(hookServer);

    const result = disableMethod('rest', 'socketio', 'external')(hook);
    assert.equal(result, undefined);

    assert.throws(() => { disableMethod('rest', 'socketio', 'server')(hook); });
  });

  it('finds external', () => {
    const hook = clone(hookSocketio);

    const result = disableMethod('rest', 'server')(hook);
    assert.equal(result, undefined);

    assert.throws(() => { disableMethod('rest', 'server', 'external')(hook); });
  });

  it('succeeds if not provider', () => {
    const hook = clone(hookServer);

    const result = disableMethod('socketio')(hook);
    assert.equal(result, undefined);
  });

  it('succeeds if not external', () => {
    const hook = clone(hookServer);

    const result = disableMethod('external')(hook);
    assert.equal(result, undefined);
  });

  it('succeeds if not server', () => {
    const hook = clone(hookSocketio);

    const result = disableMethod('server')(hook);
    assert.equal(result, undefined);
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
