
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const { callingParams, softDelete2, stashBefore } = require('../../lib/services');

const recsInit = [
  { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1 },
  { id: 1, email: 'b', password: 'b', key1: 'a', key2: '2', deletedAt: -1, foo: 1 },
  { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1 },
  { id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', deletedAt: -1, foo: -1 },
  { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: 1, foo: -1 },
  { id: 5, email: 'f', password: 'f', key1: 'a', key2: '2', deletedAt: 1, foo: -1 }
];

function services (options) {
  return function () {
    const app = this;
    const memoryStore = convertRecsToMemoryStore(options.recs);

    app.configure(users(Object.assign({}, options, memoryStore)));
  };
}

function users (options) {
  return function () {
    const app = this;

    app.use('/users', memory({
      store: options.store,
      startId: options.startId
    }));

    app.service('users').hooks({
      before: {
        all: options.all || [],
        find: options.find || [],
        create: options.create || [],
        get: options.get || [],
        update: options.update || [],
        patch: options.patch || [],
        remove: options.remove || []
      }
    });
  };
}

async function probeCall (context) {
  const params = callingParams({
    newProps: { provider: undefined }, hooksToDisable: ['softDelete2']
  })(context);

  return context.service.get(context.id, params)
    .then(recs => {
      customProbingGet = true;
      return recs;
    });
}

async function patchCall (context, options) {
  const deletedAt = options.deletedAt || 'deletedAt';
  const params = callingParams({
    query: Object.assign({}, context.params.query, { [deletedAt]: -1 }),
    newProps: { provider: undefined },
    hooksToDisable: ['softDelete2']
  })(context);

  return context.service.patch(context.id, { [deletedAt]: Date.now() }, params)
    .then(recs => {
      customRemovingPatch = true;
      return recs;
    });
}

let customProbingGet;
let customRemovingPatch;

describe('services softDelete2-b', () => {
  describe('test keepOnCreate', () => {
    let app;
    let users;

    beforeEach(() => {
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('overwrites deletedAt value', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.create({ id: 6, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: 123, foo: 1 })
        .then(data => {
          assert.deepEqual(data, {
            id: 6, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
        });
    });

    it('keeps existing deletedAt value', () => {
      users.hooks({
        before: {
          all: softDelete2({ keepOnCreate: true })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.create({ id: 6, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: 123, foo: 1 })
        .then(data => {
          assert.deepEqual(data, {
            id: 6, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: 123, foo: 1
          }, 'unexpected data');
        });
    });
  });

  describe('test context.params.$ignoreDeletedAt', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('returns deleted record', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.get(4, { $ignoreDeletedAt: true })
        .then(data => {
          assert.deepEqual(data, recsInit[4], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test allowIgnoreDeletedAt', () => {
    let app;
    let users;

    beforeEach(() => {
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: softDelete2({ allowIgnoreDeletedAt: false })
        },
        after: {
          all: softDelete2({ allowIgnoreDeletedAt: false })
        }
      });

      return users.get(4, { $ignoreDeletedAt: true })
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert(true, 'failed correctly');
        });
    });
  });

  describe('test custom probing get function', () => {
    let app;
    let users;

    beforeEach(() => {
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');

      customProbingGet = false;
    });

    it('patches active record', () => {
      users.hooks({
        before: {
          all: softDelete2({ probeCall })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.patch(0, { email: 'aa' })
        .then(data => {
          assert.deepEqual(data, {
            id: 0, email: 'aa', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
          assert.isOk(customProbingGet, 'unexpected customProbingGet');
        });
    });
  });

  describe('test custom removing patch function', () => {
    let app;
    let users;

    beforeEach(() => {
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');

      customRemovingPatch = false;
    });

    it('removes active record', () => {
      users.hooks({
        before: {
          all: softDelete2({ patchCall })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(0)
        .then(data => {
          const data1 = clone(data);
          delete data1.deletedAt;

          assert.deepEqual(data1, {
            id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', foo: 1
          }, 'unexpected data');
          assert.isAtLeast(data.deletedAt, 0);
          assert.isOk(customRemovingPatch, 'unexpected hooksRun');
        });
    });
  });

  describe('test with stashBefore', () => {
    let app;
    let users;
    let beforeRec;

    beforeEach(() => {
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');

      beforeRec = null;
    });

    it('works', async () => {
      users.hooks({
        before: {
          all: softDelete2(),
          patch: [
            stashBefore(),
            ctx => {
              beforeRec = clone(ctx.params.before);
            }]
        },
        after: {
          all: softDelete2()
        }
      });

      const data = await users.patch(3, { a: 'a' });

      assert.deepEqual(data, {
        id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', deletedAt: -1, foo: -1, a: 'a'
      }, 'unexpected data');
      assert.deepEqual(beforeRec, {
        id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', deletedAt: -1, foo: -1
      }, 'unexpected before data');
    });
  });
});

function convertRecsToMemoryStore (recs) {
  if (!Array.isArray(recs)) return undefined;

  const store = {};
  let storeId = -99999;

  recs.forEach(rec => {
    const id = rec.id;
    store[id] = clone(rec);
    storeId = Math.max(storeId, id);
  });

  return { store, storeId };
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
