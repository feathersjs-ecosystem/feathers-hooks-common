
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('chai').assert;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'startId'.
const startId = 6;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'storeInit'... Remove this comment to see the full error message
const storeInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dick Doe', key: 'b', id: 5, deleted: true }
};
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'store'.
let store;

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function services(this: any) {
  const app = this;
  app.configure(user);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function user(this: any) {
  const app = this;
  let service: any;
  let hookId: any;
  let hookData: any;
  let hookParamsQuery: any;
  store = clone(storeInit);

  app.use('/users', memory({
    store,
    startId
  }));

  app.service('users').hooks({
    before: {
      all: [
        function(this: any, hook: any) {
          if (hook.app !== app) { throw new Error('App wrong 0.'); }
          service = this;

          hook.data = { a: 'a' };

          hookId = hook.id;
          hookData = clone(hook.data);
          hookParamsQuery = clone(hook.params.query);

          return hook;
        },
        hooks.combine(
          function(this: any, hook: any) {
            if (hook.app !== app) { throw new Error('App wrong 1.'); }
            if (service !== this) { throw new Error('Service wrong 1.'); }
            hook.params.trace = ['sync1'];
            return hook;
          },
          function(this: any, hook: any) {
            if (hook.app !== app) { throw new Error('App wrong 2.'); }
            if (service !== this) { throw new Error('Service wrong 2.'); }

            if (hook.params.query.key === 'b') { throw new Error('Requested throw.'); }

            hook.params.trace.push('promise1');
            return Promise.resolve(hook);
          },
          function(this: any, hook: any) {
            if (hook.app !== app) { throw new Error('App wrong 3.'); }
            if (service !== this) { throw new Error('Service wrong 3.'); }
            hook.params.trace.push('sync2');
          },
          function(this: any, hook: any) {
            if (hook.app !== app) { throw new Error('App wrong 4.'); }
            if (service !== this) { throw new Error('Service wrong 4.'); }
            hook.params.trace.push('cb1');

            return hook;
          },
          function(this: any, hook: any) {
            if (hook.app !== app) { throw new Error('App wrong 5.'); }
            if (service !== this) { throw new Error('Service wrong 5.'); }
            hook.params.trace.push('sync3');
            return hook;
          }
        ),
        function(this: any, hook: any) {
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services combine', () => {
  let app;
  let user: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    app = feathers()
      .configure(services);
    user = app.service('users');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs successful hooks', (done: any) => {
    user.find({ query: { key: 'a' } })
      .then((data: any) => {
        done();
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws on unsuccessful hook', (done: any) => {
    user.find({ query: { key: 'b' } })
      .catch(() => {
        done();
      })
      .then((data: any) => {
        assert.fail(true, false);
        done();
      });
  });
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
