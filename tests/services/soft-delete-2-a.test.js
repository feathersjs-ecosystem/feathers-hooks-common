
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const sift = require('sift');
const SKIP = require('@feathersjs/feathers').SKIP;
const { softDelete2 } = require('../../lib/services');

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

describe('services softDelete2-a', () => {
  describe('test how hooks work', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('SKIP just skips its own before or after', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), () => SKIP, queuer(hooksRun, 'before.all.2')]
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), () => SKIP, queuer(hooksRun, 'after.all.2')]
        }
      });

      return users.find({ query: {} })
        .then(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('setting context.result does not skip remaining hooks', () => {
      function setResult (context) {
        context.result = { a: 1 };
        return context;
      }

      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), setResult, queuer(hooksRun, 'before.all.2')]
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1')]
        }
      });

      return users.find({ query: {} })
        .then(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.2', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('"all" hooks run before other hooks', () => {
      users.hooks({
        before: {
          all: queuer(hooksRun, 'before.all.1'),
          find: queuer(hooksRun, 'before.find.1')
        },
        after: {
          all: queuer(hooksRun, 'after.all.1'),
          find: queuer(hooksRun, 'after.find.1')
        }
      });

      return users.find({ query: {} })
        .then(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.find.1', 'after.all.1', 'after.find.1'], 'unexpected hooksRun');
        });
    });
  });

  describe('test scaffolding', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit, all: queuer(hooksRun, 'before.all.1'), find: queuer(hooksRun, 'before.find.1') }));
      users = app.service('users');
    });

    it('runs scaffolding', () => {
      users.hooks({
        before: {
          all: queuer(hooksRun, 'before.all.2'),
          find: queuer(hooksRun, 'before.find.2')
        },
        after: {
          find: queuer(hooksRun, 'after.find.1'),
          all: queuer(hooksRun, 'after.all.1')
        }
      });

      return users.find({ query: {} })
        .then(data => {
          assert.deepEqual(data, recsInit, 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', 'before.find.1', 'before.all.2', 'before.find.2', 'after.all.1', 'after.find.1'
          ], 'unexpected hooksRun');
        });
    });
  });

  describe('test find', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('returns only active records', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.find({ query: {} })
        .then(data => {
          assert.deepEqual(data, sift({ deletedAt: { $eq: -1 } }, recsInit), 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('works with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.find({ query: {} })
        .then(data => {
          assert.deepEqual(data, sift({ foo: { $eq: -1 } }, recsInit), 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('$ignoreDeletedAt ignores deletedAt prop', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.find({ query: {}, $ignoreDeletedAt: true })
        .then(data => {
          assert.deepEqual(data, recsInit, 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test create', () => {
    let app;
    let users;
    let hooksRun;
    const recsCreate = [
      { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: 11111 },
      { id: 1, email: 'b', password: 'b', key1: 'a', key2: '2', deletedAt: -1 },
      { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1' },
      { id: 3, email: 'd', password: 'd', key1: 'a', key2: '2' },
      { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1' },
      { id: 5, email: 'f', password: 'f', key1: 'a', key2: '2' }
    ];

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({}));
      users = app.service('users');
    });

    it('adds deletedAt', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.create(recsCreate)
        .then(data => {
          assert.deepEqual(data, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1 },
            { id: 1, email: 'b', password: 'b', key1: 'a', key2: '2', deletedAt: -1 },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1 },
            { id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', deletedAt: -1 },
            { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: -1 },
            { id: 5, email: 'f', password: 'f', key1: 'a', key2: '2', deletedAt: -1 }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('works with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.create(recsCreate)
        .then(data => {
          assert.deepEqual(data, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: 11111, foo: -1 },
            { id: 1, email: 'b', password: 'b', key1: 'a', key2: '2', deletedAt: -1, foo: -1 },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', foo: -1 },
            { id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', foo: -1 },
            { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', foo: -1 },
            { id: 5, email: 'f', password: 'f', key1: 'a', key2: '2', foo: -1 }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test un-optimized get', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('returns active record', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.get(1)
        .then(data => {
          assert.deepEqual(data, recsInit[1], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('get probe runs no hooks', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.get(1)
        .then(data => {
          assert.deepEqual(data, recsInit[1], 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded get
            'before.all.1', 'after.all.1', // probing get
            'before.all.2', 'before.get.1', 'after.all.1', 'after.all.2', 'after.get.1' // coded get
          ], 'unexpected hooksRun');
        });
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.get(4)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('returns active record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.get(5)
        .then(data => {
          assert.deepEqual(data, recsInit[5], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('throws on inactive record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.get(0)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test optimized get', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('returns active record', () => {
      users.hooks({
        before: {
          all: softDelete2({ skipProbeOnGet: true })
        },
        after: {
          all: softDelete2({ skipProbeOnGet: true })
        }
      });

      return users.get(1)
        .then(data => {
          assert.deepEqual(data, recsInit[1], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('get probe does not run', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2({ skipProbeOnGet: true }), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2({ skipProbeOnGet: true }), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.get(1)
        .then(data => {
          assert.deepEqual(data, recsInit[1], 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded get
            'before.all.2', 'before.get.1', 'after.all.1', 'after.all.2', 'after.get.1' // coded get
          ], 'unexpected hooksRun');
        });
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2({ skipProbeOnGet: true }), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2({ skipProbeOnGet: true }), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.get(4)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.2', 'before.get.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('returns active record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo', skipProbeOnGet: true })
        },
        after: {
          all: softDelete2({ deletedAt: 'foo', skipProbeOnGet: true })
        }
      });

      return users.get(5)
        .then(data => {
          assert.deepEqual(data, recsInit[5], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('throws on inactive record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo', skipProbeOnGet: true })
        },
        after: {
          all: softDelete2({ deletedAt: 'foo' })
        }
      });

      return users.get(0)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test update', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('updates active record', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.update(0, {
        id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
      })
        .then(data => {
          assert.deepEqual(data, {
            id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
        });
    });

    it('get probe runs no hooks', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1')
        }
      });

      return users.update(0, {
        id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
      })
        .then(data => {
          assert.deepEqual(data, {
            id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded update
            'before.all.1', 'after.all.1', // probing get
            'before.all.2', 'before.update.1', 'after.all.1', 'after.all.2', 'after.update.1' // coded update
          ], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
        });
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1')
        }
      });

      return users.update(5, {
        id: 5, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: -1, foo: 1
      })
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('updates active record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.update(5, {
        id: 5, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: 1, foo: -1
      })
        .then(data => {
          assert.deepEqual(data, {
            id: 5, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: 1, foo: -1
          }, 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(5, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 5, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: 1, foo: -1
          }, 'unexpected data');
        });
    });

    it('throws on inactive record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.update(0, {
        id: 0, email: 'aa', password: 'aa', key1: 'aa', key2: '1', deletedAt: 1, foo: -1
      })
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test patch single record', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('patches active record', () => {
      users.hooks({
        before: {
          all: softDelete2()
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
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 0, email: 'aa', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
        });
    });

    it('get probe runs no hooks', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1'),
          patch: queuer(hooksRun, 'before.patch.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.patch(0, { email: 'aa' })
        .then(data => {
          assert.deepEqual(data, {
            id: 0, email: 'aa', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded patch
            'before.all.1', 'after.all.1', // probing get
            'before.all.2', 'before.patch.1', 'after.all.1', 'after.all.2', 'after.patch.1' // coded patch
          ], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 0, email: 'aa', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1
          }, 'unexpected data');
        });
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1'),
          patch: queuer(hooksRun, 'before.patch.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1'),
          patch: queuer(hooksRun, 'after.patch.1')
        }
      });

      return users.patch(5, { email: 'aa' })
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('patches active record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.patch(5, { email: 'ff' })
        .then(data => {
          assert.deepEqual(data, {
            id: 5, email: 'ff', password: 'f', key1: 'a', key2: '2', deletedAt: 1, foo: -1
          }, 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(5, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, {
            id: 5, email: 'ff', password: 'f', key1: 'a', key2: '2', deletedAt: 1, foo: -1
          }, 'unexpected data');
        });
    });

    it('throws on inactive record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.patch(0, { email: 'aa' })
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test patch multiple records', () => {
    let app;
    let users;
    let hooksRun;
    const recsInit = [
      { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1 },
      { id: 1, email: 'b', password: 'b', key1: 'a', key2: '2', deletedAt: -1, foo: 1 },
      { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1 },
      { id: 3, email: 'd', password: 'd', key1: 'a', key2: '2', deletedAt: -1, foo: -1 },
      { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: 1, foo: -1 },
      { id: 5, email: 'f', password: 'f', key1: 'a', key2: '2', deletedAt: 1, foo: -1 }
    ];

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('patches active records', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.patch(null, { bar: 'baz' }, { query: { key2: '1' } })
        .then(data => {
          assert.deepEqual(data, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1, bar: 'baz' },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1, bar: 'baz' }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.find({ query: { bar: 'baz' }, $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', deletedAt: -1, foo: 1, bar: 'baz' },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1, bar: 'baz' }
          ], 'unexpected data');
        });
    });

    it('patches active records with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.patch(null, { bar: 'baz' }, { query: { key2: '1' } })
        .then(data => {
          assert.deepEqual(data, [
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1, bar: 'baz' },
            { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: 1, foo: -1, bar: 'baz' }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.find({ query: { bar: 'baz' }, $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, [
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1, foo: -1, bar: 'baz' },
            { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: 1, foo: -1, bar: 'baz' }
          ], 'unexpected data');
        });
    });
  });

  describe('test remove single record', () => {
    let app;
    let users;
    let hooksRun;
    let dataReturned;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('removes active record', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(0)
        .then(data => {
          dataReturned = clone(data);
          const data1 = clone(data);
          delete data1.deletedAt;

          assert.deepEqual(data1, {
            id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', foo: 1
          }, 'unexpected data');
          assert.isAtLeast(data.deletedAt, 0);
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, dataReturned, 'unexpected data');
        });
    });

    it('get probe & removing patch run no hooks', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1'),
          patch: queuer(hooksRun, 'before.patch.1'),
          remove: queuer(hooksRun, 'before.remove.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1'),
          patch: queuer(hooksRun, 'after.patch.1'),
          remove: queuer(hooksRun, 'after.remove.1')
        }
      });

      return users.remove(0)
        .then(data => {
          dataReturned = clone(data);
          const data1 = clone(data);
          delete data1.deletedAt;

          assert.deepEqual(data1, {
            id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', foo: 1
          }, 'unexpected data');
          assert.isAtLeast(data.deletedAt, 0);
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded remove
            'before.all.1', 'after.all.1', // probing get
            'before.all.1', 'after.all.1', // removing patch
            'before.all.2', 'before.remove.1', 'after.all.1', 'after.all.2', 'after.remove.1' // coded remove
          ], 'unexpected hooksRun');

          return users.get(0, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, dataReturned, 'unexpected data');
        });
    });

    it('throws on inactive record', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1'),
          patch: queuer(hooksRun, 'before.patch.1'),
          remove: queuer(hooksRun, 'before.remove.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1'),
          patch: queuer(hooksRun, 'after.patch.1'),
          remove: queuer(hooksRun, 'after.remove.1')
        }
      });

      return users.remove(5)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, ['before.all.1', 'before.all.1', 'after.all.1'], 'unexpected hooksRun');
        });
    });

    it('updates active record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(5)
        .then(data => {
          dataReturned = clone(data);
          const data1 = clone(data);
          delete data1.foo;

          assert.deepEqual(data1, {
            id: 5, email: 'f', password: 'f', key1: 'a', key2: '2', deletedAt: 1
          }, 'unexpected data');
          assert.isAtLeast(data.deletedAt, 0);
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');

          return users.get(5, { $ignoreDeletedAt: true });
        })
        .then(rec => {
          assert.deepEqual(rec, dataReturned, 'unexpected data');
        });
    });

    it('throws on inactive record with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(0)
        .then(() => {
          assert(false, 'data returned unexpectedly');
        })
        .catch(() => {
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });
  });

  describe('test remove multiple records', () => {
    let app;
    let users;
    let hooksRun;

    beforeEach(() => {
      hooksRun = [];
      app = feathers()
        .configure(services({ recs: recsInit }));
      users = app.service('users');
    });

    it('removes active records', () => {
      users.hooks({
        before: {
          all: softDelete2()
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(null, { query: { key2: '1' } })
        .then(data => {
          const data1 = clone(data).map(rec => {
            assert.isAtLeast(rec.deletedAt, 0);
            delete rec.deletedAt;
            return rec;
          });

          assert.deepEqual(data1, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', foo: 1 },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', foo: -1 }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
    });

    it('remove hooks are run, only patch hooks before softDelete are run', () => {
      users.hooks({
        before: {
          all: [queuer(hooksRun, 'before.all.1'), softDelete2(), queuer(hooksRun, 'before.all.2')],
          get: queuer(hooksRun, 'before.get.1'),
          update: queuer(hooksRun, 'before.update.1'),
          patch: queuer(hooksRun, 'before.patch.1'),
          remove: queuer(hooksRun, 'before.remove.1')
        },
        after: {
          all: [queuer(hooksRun, 'after.all.1'), softDelete2(), queuer(hooksRun, 'after.all.2')],
          get: queuer(hooksRun, 'after.get.1'),
          update: queuer(hooksRun, 'after.update.1'),
          patch: queuer(hooksRun, 'after.patch.1'),
          remove: queuer(hooksRun, 'after.remove.1')
        }
      });

      return users.remove(null, { query: { key2: '1' } })
        .then(data => {
          const data1 = clone(data).map(rec => {
            assert.isAtLeast(rec.deletedAt, 0);
            delete rec.deletedAt;
            return rec;
          });

          assert.deepEqual(data1, [
            { id: 0, email: 'a', password: 'a', key1: 'a', key2: '1', foo: 1 },
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', foo: -1 }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [
            'before.all.1', // coded remove
            'before.all.1', 'after.all.1', // removing patch
            'before.all.2', 'before.remove.1', 'after.all.1', 'after.all.2', 'after.remove.1' // coded remove
          ], 'unexpected hooksRun');
        });
    });

    it('removes active records with custom deletedAt prop name', () => {
      users.hooks({
        before: {
          all: softDelete2({ deletedAt: 'foo' })
        },
        after: {
          all: softDelete2()
        }
      });

      return users.remove(null, { query: { key2: '1' } })
        .then(data => {
          const data1 = clone(data).map(rec => {
            assert.isAtLeast(rec.foo, 0);
            delete rec.foo;
            return rec;
          });

          assert.deepEqual(data1, [
            { id: 2, email: 'c', password: 'c', key1: 'a', key2: '1', deletedAt: -1 },
            { id: 4, email: 'e', password: 'e', key1: 'a', key2: '1', deletedAt: 1 }
          ], 'unexpected data');
          assert.deepEqual(hooksRun, [], 'unexpected hooksRun');
        });
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

function queuer (queue, id) {
  return context => {
    queue.push(id);
    return context;
  };
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
