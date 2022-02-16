
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('chai').assert;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'stashBefor... Remove this comment to see the full error message
const { stashBefore } = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'startId'.
const startId = 6;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'storeInit'... Remove this comment to see the full error message
const storeInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'John Doe', key: 'a', id: 2 },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dork Doe', key: 'b', id: 5 }
};
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'store'.
let store;
let finalParams: any;
let innerCallParams: any;

function services(this: any) {
  const app = this;
  app.configure(users);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'users'.
function users(this: any) {
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
        (context: any) => {
          if (context.params.disableStashBefore === true) {
            innerCallParams = context.params;
          }
        },
        stashBefore(),
        (context: any) => {
          finalParams = context.params;
        }
      ]
    }
  });
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services stash-before', () => {
  let app;
  let users: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    innerCallParams = finalParams = null;

    app = feathers()
      .configure(services);

    users = app.service('users');
  });

  ['get', 'update', 'patch', 'remove'].forEach(method => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`stashes on ${method}`, () => {
      return users[method](0, {})
        .then(() => {
          assert.deepEqual(finalParams.before, storeInit[0]);
        });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Do not stash when query is used in remove', () => {
    return users.remove(null, { query: {} })
      .then(() => {
        assert.notProperty(finalParams, 'before');
      });
  });

  ['create', 'find'].forEach(method => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`throws on ${method}`, (done: any) => {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
