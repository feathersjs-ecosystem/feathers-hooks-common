
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const hooks = require('../../lib/services');

const startId = 6;
const storeInit = {
  '0': { name: 'Jane Doe', key: 'a', id: 0 },
  '1': { name: 'Jack Doe', key: 'a', id: 1 },
  '2': { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  '3': { name: 'Rick Doe', key: 'b', id: 3 },
  '4': { name: 'Dick Doe', key: 'b', id: 4 },
  '5': { name: 'Dick Doe', key: 'b', id: 5, deleted: true }
};

let store;
let getCallParams;

function services () {
  const app = this;
  app.configure(user);
}

function user () {
  const app = this;
  store = clone(storeInit);

  class UsersService extends memory.Service {
    constructor (...args) {
      super(...args);
      this.get_call_count = 0;
    }
    get (...args) {
      this.get_call_count += 1;
      return super.get(...args);
    }
  }

  app.use('/users', new UsersService({store, startId}));

  app.service('users').hooks({
    before: {
      all: [
        hook => {
          if (hook.method === 'get') {
            getCallParams = clone(hook.params);
          }
        },
        hooks.softDelete()
      ]
    }
  });
}

describe('services softDelete', () => {
  let app;
  let user;

  beforeEach(() => {
    app = feathers()
      .configure(services);

    user = app.service('users');
  });

  describe('find', () => {
    it('find - does not return deleted items', done => {
      user.find()
        .then(data => {
          assert.deepEqual(data, [ store['0'], store['1'], store['3'], store['4'] ]);
          done();
        });
    });
  });

  describe('get', () => {
    it('returns an undeleted item', done => {
      user.get(0)
        .then(data => {
          assert.deepEqual(data, storeInit['0']);
          assert.equal(user.get_call_count, 1);
          done();
        });
    });

    it('throws on deleted item', done => {
      user.get(2)
        .catch(() => {
          assert.equal(user.get_call_count, 1);
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });

    it('throws on missing item', done => {
      user.get(99)
        .catch(() => {
          assert.equal(user.get_call_count, 1);
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });
  });

  describe('create', () => {
    it('adds items', done => {
      user.create({ name: 'John Doe', key: 'x' })
        .then(data => {
          const newUser = { name: 'John Doe', key: 'x', id: startId };
          assert.deepEqual(data, newUser);
          assert.deepEqual(store, Object.assign({}, store, { [startId]: newUser }));

          done();
        });
    });

    it('adds items marked deleted', done => {
      user.create({ name: 'John Doe', deleted: true })
        .then(data => {
          const newUser = { name: 'John Doe', deleted: true, id: startId };
          assert.deepEqual(data, newUser);
          assert.deepEqual(store, Object.assign({}, store, { [startId]: newUser }));

          done();
        });
    });
  });

  describe('update, with id', () => {
    it('updates an undeleted item', done => {
      user.update(0, { y: 'y' })
        .catch(err => console.log(err))
        .then(data => {
          assert.deepEqual(data, { y: 'y', id: 0 });
          done();
        });
    });

    it('throws on deleted item', done => {
      user.update(2, { y: 'y' })
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });

    it('throws on missing item', done => {
      user.update(99, { y: 'y' })
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });
  });

  /*
  // update without an id throws BadRequest: You can not replace multiple instances. Did you mean 'patch'?
  describe('update, without id', () => {
    it('updates all nondeleted items if no filter', done => {
      user.update(null, { x: 'x' })
        .then(data => {
          console.log(data);
          assert.deepEqual(data, [
            { x: 'x', id: 0 }, { x: 'x', id: 1 }, { x: 'x', id: 3 }, { x: 'x', id: 4 },
          ]);

          done();
        });
    });

    it('updates filtered, nondeleted items', done => {
      user.update(null, { x: 'x' }, { query: { name: 'Jane Doe' }})
        .then(data => {
          console.log(data);
          assert.deepEqual(data, [{ name: 'Jane Doe', id: 0 }]);

          done();
        });
    });
  });
  */

  describe('patch, with id', () => {
    it('patches an undeleted item', done => {
      user.patch(0, { y: 'y' })
        .then(data => {
          assert.deepEqual(data, Object.assign({}, storeInit['0'], { y: 'y' }));
          done();
        });
    });

    it('throws on deleted item', done => {
      user.patch(2, { y: 'y' })
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });

    it('throws on missing item', done => {
      user.patch(99, { y: 'y' })
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });
  });

  describe('patch, without id', () => {
    it('patches all nondeleted items if no filter', done => {
      user.patch(null, { x: 'x' })
        .then(data => {
          let expected = clone(
            [ storeInit['0'], storeInit['1'], storeInit['3'], storeInit['4'] ]);
          expected.forEach(obj => { obj.x = 'x'; });
          assert.deepEqual(data, expected);

          expected = clone(storeInit);
          [0, 1, 3, 4].forEach(i => { expected[i].x = 'x'; });
          assert.deepEqual(store, expected);

          done();
        });
    });

    it('patches filtered, nondeleted items', done => {
      user.patch(null, { x: 'x' }, { query: { key: 'a' } })
        .then(data => {
          let expected = clone([ storeInit['0'], storeInit['1'] ])
            .map(obj => Object.assign({}, obj, { x: 'x' }));
          assert.deepEqual(data, expected);

          expected = clone(storeInit);
          [0, 1].forEach(i => { expected[i].x = 'x'; });
          assert.deepEqual(store, expected);
          done();
        });
    });
  });

  describe('remove, with id', () => {
    it('marks item as deleted', done => {
      user.remove(0)
        .then(data => {
          assert.deepEqual(data, Object.assign({}, store['0'], { deleted: true }));
          done();
        });
    });

    it('throws if item already deleted', done => {
      user.remove(2)
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });

    it('throws if item missing', done => {
      user.remove(99)
        .catch(() => {
          done();
        })
        .then(data => {
          assert.fail(true, false);
          done();
        });
    });
  });

  describe('remove, without id', () => {
    it('marks filtered items as deleted', done => {
      user.remove(null, { query: { key: 'a' } })
        .then(data => {
          assert.deepEqual(data, [
            Object.assign({}, store['0'], { deleted: true }),
            Object.assign({}, store['1'], { deleted: true })
          ]);
          done();
        });
    });

    it('handles nothing found', done => {
      user.remove(null, { query: { key: 'z' } })
        .then(data => {
          assert.deepEqual(data, []);
          done();
        });
    });
  });

  describe('handles params', () => {
    it('uses all params for get', done => {
      getCallParams = null;

      const params = { a: 1, b: 2 };
      const expected = { a: 1, b: 2, query: { $disableSoftDelete: true } };

      user.get(0, params)
        .then(data => {
          assert.deepEqual(data, storeInit['0']);
          assert.equal(user.get_call_count, 1);
          assert.deepEqual(getCallParams, expected);
          done();
        });
    });

    it('uses selected params for other methods', done => {
      getCallParams = null;

      const params = { a: 1, b: 2, authenticated: 'a', user: 'b' };
      const expected = { query: { $disableSoftDelete: true }, authenticated: 'a', user: 'b', _populate: 'skip' };

      user.patch(0, { x: 1 }, params)
        .then(data => {
          assert.equal(user.get_call_count, 1);
          assert.deepEqual(getCallParams, expected);
          done();
        });
    });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
