
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const hooks = require('../../lib/services');

const startId = 6;
const storeInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dick Doe', key: 'b', id: 5, deleted: true }
};
let store;

function services () {
  const app = this;
  app.configure(user);
}

function user () {
  const app = this;
  let service;
  let hookId;
  let hookData;
  let hookParamsQuery;
  store = clone(storeInit);

  app.use('/users', memory({
    store,
    startId
  }));

  app.service('users').hooks({
    before: {
      all: [
        function (hook) {
          if (hook.app !== app) { throw new Error('App wrong 0.'); }
          service = this;

          hook.data = { a: 'a' };

          hookId = hook.id;
          hookData = clone(hook.data);
          hookParamsQuery = clone(hook.params.query);

          return hook;
        },
        hooks.combine(
          function (hook) {
            if (hook.app !== app) { throw new Error('App wrong 1.'); }
            if (service !== this) { throw new Error('Service wrong 1.'); }
            hook.params.trace = ['sync1'];
            return hook;
          },
          function (hook) {
            if (hook.app !== app) { throw new Error('App wrong 2.'); }
            if (service !== this) { throw new Error('Service wrong 2.'); }

            if (hook.params.query.key === 'b') { throw new Error('Requested throw.'); }

            hook.params.trace.push('promise1');
            return Promise.resolve(hook);
          },
          function (hook) {
            if (hook.app !== app) { throw new Error('App wrong 3.'); }
            if (service !== this) { throw new Error('Service wrong 3.'); }
            hook.params.trace.push('sync2');
          },
          function (hook) {
            if (hook.app !== app) { throw new Error('App wrong 4.'); }
            if (service !== this) { throw new Error('Service wrong 4.'); }
            hook.params.trace.push('cb1');

            return hook;
          },
          function (hook) {
            if (hook.app !== app) { throw new Error('App wrong 5.'); }
            if (service !== this) { throw new Error('Service wrong 5.'); }
            hook.params.trace.push('sync3');
            return hook;
          }
        ),
        function (hook) {
          if (hook.app !== app) { throw new Error('App wrong 9.'); }
          if (service !== this) { throw new Error('Service wrong 9.'); }

          assert.equal(hook.id, hookId);
          assert.deepEqual(hook.data, hookData);
          assert.deepEqual(hook.params.query, hookParamsQuery);

          assert.deepEqual(hook.params.trace, ['sync1', 'promise1', 'sync2', 'cb1', 'sync3']);
        }
      ]
    }
  });
}

describe('services combine', () => {
  let app;
  let user;

  beforeEach(() => {
    app = feathers()
      .configure(services);
    user = app.service('users');
  });

  it('runs successful hooks', done => {
    user.find({ query: { key: 'a' } })
      .then(data => {
        done();
      });
  });

  it('throws on unsuccessful hook', done => {
    user.find({ query: { key: 'b' } })
      .catch(() => {
        done();
      })
      .then(data => {
        assert.fail(true, false);
        done();
      });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
