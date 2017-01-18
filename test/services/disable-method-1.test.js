
// test disableMethod works like disable worked (minus its predicate)

import { assert } from 'chai';
import { disableMethod } from '../../src/services';

describe('services disableMethod-1', () => {
  let hookRest;
  let hookSocketio;
  let hookServer;

  beforeEach(() => {
    hookRest = { method: 'create', params: { provider: 'rest' } };
    hookSocketio = { method: 'create', params: { provider: 'socketio' } };
    hookServer = { method: 'create', params: { provider: '' } };
  });

  it('disables all providers with no param', () => {
    assert.throws(() => { disableMethod()(hookSocketio); });
    assert.throws(() => { disableMethod()(hookServer); });
  });

  it('disables a provider', () => {
    assert.throws(() => { disableMethod('socketio')(hookSocketio); });
  });

  it('does not disable the server', () => {
    disableMethod('socketio')(hookServer);
    assert.throws(() => { disableMethod('socketio')(hookSocketio); });
  });

  it('does not disable another provider', () => {
    disableMethod('socketio')(hookRest);
    assert.throws(() => { disableMethod('socketio')(hookSocketio); });
  });

  it('disables multiple providers', () => {
    disableMethod('socketio', 'rest')(hookServer);
    assert.throws(() => { disableMethod('socketio', 'rest')(hookSocketio); });
    assert.throws(() => { disableMethod('socketio', 'rest')(hookRest); });
  });

  it('"external" disables all external providers', () => {
    disableMethod('socketio', 'rest')(hookServer);
    assert.throws(() => { disableMethod('socketio', 'rest')(hookSocketio); });
    assert.throws(() => { disableMethod('socketio', 'rest')(hookRest); });
  });
});
