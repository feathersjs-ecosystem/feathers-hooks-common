
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const { modifyWithSlug } = require('../../src/services');

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
    startId,
    paginate: {
      default: 25,
      max: 25
    }
  }));

  app.service('users').before({
    patch: modifyWithSlug('name'),
    remove: modifyWithSlug('name')
  });
}

describe('services modifyWithSlug', () => {
  let app;
  let user;

  beforeEach(() => {
    app = feathers()
      .configure(feathersHooks())
      .configure(services);
    user = app.service('users');
  });

  it('patch using id', () => {
    user.patch(0, { key: 'a1' })
      .then(result => {
        assert.deepEqual(result, [Object.assign({}, storeInit[0], { key: 'a1' })]);
      });
  });

  it('patch using slug', () => {
    return user.patch('Jack', { key: 'a2' })
      .then(result => {
        assert.deepEqual(result, [Object.assign({}, storeInit[1], { key: 'a2' })]);
      });
  });

  it('patch error using missing key', () => {
    return user.patch('xxxx', { key: '99' })
      .then(() => {
        assert.fail(true, false);
      })
      .catch(() => {});
  });

  it('remove using id', () => {
    return user.remove(0)
      .then(result => user.find({}))
      .then(result => {
        assert.equal(result.data.length, 5);
      });
  });

  it('remove using slug', () => {
    return user.remove('Jack')
      .then(result => user.find({}))
      .then(result => {
        assert.equal(result.data.length, 5);
      });
  });

  it('remove error using missing key', () => {
    return user.remove('xxxx')
      .then(() => {
        assert.fail(true, false);
      })
      .catch(() => {});
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
