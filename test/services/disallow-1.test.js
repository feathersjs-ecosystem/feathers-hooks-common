
// test disallow works like disable worked (minus its predicate)

import { assert } from 'chai';
import { disallow } from '../../src/services';

describe('services disallow-1', () => {
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
