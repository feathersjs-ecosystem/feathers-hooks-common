
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const { getWithSlug } = require('../../src/services');

const startId = 6;
const storeInit = {
  '0': { name: 'Jane', key: 'a', id: 0 },
  '1': { name: 'Jack', key: 'a', id: 1 },
  '2': { name: 'Jane', key: 'a', id: 2 },
  '3': { name: 'Rick', key: 'b', id: 3 },
  '4': { name: 'Dick', key: 'b', id: 4 },
  '5': { name: 'Kick', key: 'b', id: 5 }
};
let store;

function services () {
  const app = this;
  app.configure(user);
}

function user () {
  const app = this;
  store = clone(storeInit);

  app.use('/users', memory({
    store,
    startId
  }));

  app.service('users').before({
    get: getWithSlug('name')
  });
}

describe('services getWithSlug', () => {
  let app;
  let user;

  beforeEach(() => {
    app = feathers()
      .configure(feathersHooks())
      .configure(services);
    user = app.service('users');
  });

  it('gets using id', () => {
    return user.get('0')
      .then(result => {
        assert.deepEqual(result, storeInit[0]);
      });
  });

  it('gets using slug', () => {
    return user.get('Jack')
      .then(result => {
        assert.deepEqual(result, storeInit[1]);
      });
  });

  it('error using missing key', () => {
    user.get('xxxx')
      .then(result => {
        assert.fail(true, false);
      })
      .catch(() => true);
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
