
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const { stashBefore } = require('../../lib/services');

const startId = 6;
const storeInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'John Doe', key: 'a', id: 2 },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dork Doe', key: 'b', id: 5 }
};
let store;
let finalParams;
let innerCallParams;

function services () {
  const app = this;
  app.configure(users);
}

function users () {
  const app = this;
  store = clone(storeInit);

  app.use('users', memory({
    store,
    startId,
    multi: true
  }));

  app.service('users').hooks({
    before: {
      all: [
        context => {
          if (context.params.disableStashBefore === true) {
            innerCallParams = context.params;
          }
        },
        stashBefore(),
        context => {
          finalParams = context.params;
        }
      ]
    }
  });
}

describe('services stash-before', () => {
  let app;
  let users;

  beforeEach(() => {
    innerCallParams = finalParams = null;

    app = feathers()
      .configure(services);

    users = app.service('users');
  });

  ['get', 'update', 'patch', 'remove'].forEach(method => {
    it(`stashes on ${method}`, () => {
      return users[method](0, {})
        .then(() => {
          assert.deepEqual(finalParams.before, storeInit[0]);
        });
    });
  });

  it('Do not stash when query is used in remove', () => {
    return users.remove(null, { query: {} })
      .then(() => {
        assert.notProperty(finalParams, 'before');
      });
  });

  ['create', 'find'].forEach(method => {
    it(`throws on ${method}`, done => {
      users[method]({})
        .then(() => {
          assert(false, 'unexpectedly successful');
          done();
        })
        .catch(() => {
          done();
        });
    });
  });

  it('stashes on get with original params', () => {
    return users.get(0, { provider: 'socketio', eyecatcher: -1 })
      .then(() => {
        assert.equal(finalParams.provider, 'socketio');
        assert.equal(finalParams.eyecatcher, -1);

        assert.equal(innerCallParams.provider, 'socketio');
        assert.equal(innerCallParams.eyecatcher, -1);
        assert.notProperty(innerCallParams, 'authenticated');
        assert.notProperty(innerCallParams, 'user');
      });
  });

  it('stashes on patch with custom params', () => {
    return users.patch(0, {}, { provider: 'socketio', eyecatcher: -1 })
      .then(() => {
        assert.equal(finalParams.provider, 'socketio');
        assert.equal(finalParams.eyecatcher, -1);

        assert.equal(innerCallParams.provider, 'socketio');
        assert.notProperty(innerCallParams, 'eyecatcher');
        assert.property(innerCallParams, 'authenticated');
        assert.property(innerCallParams, 'user');
      });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
