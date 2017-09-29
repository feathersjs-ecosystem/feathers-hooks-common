import { Service as MemoryService } from 'feathers-memory';
import { assert, expect } from 'chai';
import feathers from 'feathers';
import feathersHooks from 'feathers-hooks';
import { softDelete } from '../../src/services';

/******************************************************************************/
// Data
/******************************************************************************/

const storeInitStartId = 6;
const storeInit = {
  '0': { name: 'Jane Doe', key: 'a', id: 0 },
  '1': { name: 'Jack Doe', key: 'a', id: 1 },
  '2': { name: 'Jack Doe', key: 'a', id: 2, deleted: true },
  '3': { name: 'Rick Doe', key: 'b', id: 3 },
  '4': { name: 'Dick Doe', key: 'b', id: 4 },
  '5': { name: 'Dary Doe', key: 'b', id: 5, deleted: true }
};

let getCallParams, afterSoftDeleteParams;

/******************************************************************************/
// Helper
/******************************************************************************/

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function merge (...args) {
  return Object.assign({}, ...args);
}

class UsersService extends MemoryService {
  constructor (...args) {
    super(...args);
    this.get_call_count = 0;
  }
  get (...args) {
    this.get_call_count += 1;
    return super.get(...args);
  }
}

function createTestApp (softDeleteConfig, store = clone(storeInit), startId = storeInitStartId) {
  const app = feathers()
    .configure(feathersHooks())
    .use('users', new UsersService({ store, startId }));

  app.service('users').before({
    all: [
      hook => {
        if (hook.method === 'get') {
          getCallParams = clone(hook.params);
        }
      },
      softDelete(softDeleteConfig),
      hook => {
        afterSoftDeleteParams = hook.params;
      }
    ]
  });

  return app;
}

/******************************************************************************/
// Tests
/******************************************************************************/

describe('services softDelete', () => {
  let app;
  let user;

  beforeEach(() => {
    app = createTestApp();
    user = app.service('users');
  });

  describe('configure', () => {
    it('takes either a string or object', () => {
      expect(() => softDelete('removed'))
        .to.not.throw();

      expect(() => softDelete({ field: 'removed' }))
        .to.not.throw();
    });

    describe('config.field', () => {
      it('customizes the deleted field', async () => {
        app = createTestApp('removed', {}, 0);
        const users = app.service('users');

        let jane = await users.create({ name: 'Jane Doe' });
        jane = await users.remove(jane.id);

        assert(jane.removed, 'Field not altered.');
      });
    });

    describe('config.setDeleted', () => {
      it('if supplied, must be a function', () => {
        for (const setDeleted of [ () => true, () => new Date() ]) {
          expect(() => softDelete({ setDeleted }))
            .to.not.throw();
        }

        for (const setDeleted of ['not', /a/, !Function]) {
          expect(() => softDelete({ setDeleted }))
            .to.throw('config.setDeleted must be a function');
        }
      });
      it('customizes the value placed on deleted fields', async () => {
        app = createTestApp({
          setDeleted: () => new Date()
        });

        const users = app.service('users');
        const jane = await users.remove('0');

        assert(jane.deleted instanceof Date, 'Field not altered.');
      });
      it('takes hook as argument', async () => {
        let hook;
        app = createTestApp({
          setDeleted: h => { hook = h; return true; }
        });

        const users = app.service('users');
        await users.remove(0);

        assert(['app', 'service', 'data', 'params'].every(key => key in hook),
        'argument doesnt seem to be a hook object.');
      });

      it('throws if value returned is not truthy value.', async () => {
        app = createTestApp({
          setDeleted: h => false
        });

        const users = app.service('users');
        let err;
        try {
          await users.remove(0);
        } catch (e) {
          err = e;
        }

        assert(err && err.message === 'config.setDeleted must return a truthy value.',
        'error not thrown!');
      });

      it('is asyncronous', async () => {
        app = createTestApp({
          setDeleted: h => new Promise(resolve => setTimeout(resolve('resolved'), 100))
        });

        const users = app.service('users');
        const jane = await users.remove(0);

        assert(jane.deleted === 'resolved', 'error not thrown!');
      });
    });

    describe('config.allowClientDisable', () => {
      it('allows clients to skip soft deletion', async () => {
        app = createTestApp({
          allowClientDisable: false
        });

        const users = app.service('users');
        const jane = await users.remove('0', { provider: 'rest', query: { $disableSoftDelete: true } });

        assert(jane.deleted instanceof Date === false, 'Client was able to skip soft-delete.');
      });
    });

    describe('config.disableParam', () => {
      it('sets the name of the disable parameter', async () => {
        app = createTestApp({
          disableParam: '$skipSoftDelete'
        });

        const users = app.service('users');
        const jane = await users.remove('0', { $skipSoftDelete: true });

        assert(jane.deleted instanceof Date === false, 'paramName ignored.');
      });
    });
  });

  describe('find', () => {
    it('find - does not return deleted items', async () => {
      const data = await user.find();

      const { store } = user;

      const shouldBe = [0, 1, 3, 4].map(index => store[index]);

      assert.deepEqual(data, shouldBe);
    });
  });

  describe('get', () => {
    it('returns an undeleted item', async () => {
      const data = await user.get(0);

      assert.deepEqual(data, storeInit['0']);
      assert.equal(user.get_call_count, 1);
    });

    it('throws on deleted item', async () => {
      let err;
      try {
        await user.get(2);
      } catch (e) {
        err = e;
      }
      assert(err, 'Error was not thrown');
      assert.equal(user.get_call_count, 1);
    });

    it('throws on missing item', async () => {
      try {
        await user.get(99);
        assert.fail(true, false);
      } catch (err) {
        assert.equal(user.get_call_count, 1);
      }
    });

    it('throws on null id', async () => {
      let err;
      try {
        await user.get();
      } catch (e) {
        err = e;
      }
      assert(err);
      assert.equal(user.get_call_count, 1);
    });
  });

  describe('create', () => {
    it('adds items', async () => {
      const john = await user.create({ name: 'John Doe', key: 'x' });

      const { store } = user;

      const johnShouldBe = { name: 'John Doe', key: 'x', id: storeInitStartId };
      assert.deepEqual(john, johnShouldBe);

      const storeShouldBe = merge(store, { [storeInitStartId]: john });
      assert.deepEqual(store, storeShouldBe);
    });

    it('adds items marked deleted', async () => {
      const john = await user.create({ name: 'John Doe', deleted: true });

      const { store } = user;

      const johnShouldBe = { name: 'John Doe', deleted: true, id: storeInitStartId };
      assert.deepEqual(john, johnShouldBe);

      const storeShouldBe = merge(store, { [storeInitStartId]: john });
      assert.deepEqual(store, storeShouldBe);
    });
  });

  describe('update, with id', () => {
    it('updates an undeleted item', async () => {
      const y = 'y';

      const data = await user.update(0, { y });

      assert.deepEqual(data, { y, id: 0 });
    });

    it('throws on deleted item', async () => {
      const y = 'y';
      let err;
      try {
        await user.update(2, { y });
      } catch (e) {
        err = e;
      }
      assert(err, 'Error was not thrown');
    });

    it('throws on missing item', async () => {
      const y = 'y';
      let err;
      try {
        await user.update(99, { y });
      } catch (e) {
        err = e;
      }
      assert(err, 'Error was not thrown');
    });
  });

  describe('patch, with id', () => {
    it('patches an undeleted item', async () => {
      const y = 'y';
      const data = await user.patch(0, { y });
      const dataShouldBe = merge(storeInit['0'], { y });

      assert.deepEqual(data, dataShouldBe);
    });

    it('throws on deleted item', async () => {
      let err;
      try {
        await user.patch(2, { y: 'y' });
      } catch (e) {
        err = e;
      }
      assert(err, 'Error was not thrown');
    });

    it('throws on missing item', async () => {
      let err;
      try {
        await user.patch(99, { y: 'y' });
      } catch (e) {
        err = e;
      }
      assert(err, 'Error was not thrown');
    });
  });

  describe('patch, without id', () => {
    it('patches all nondeleted items if no filter', async () => {
      const x = 'x';

      const data = await user.patch(null, { x });

      let expected = [0, 1, 3, 4].map(index => merge(storeInit[index], { x }));
      assert.deepEqual(data, expected);

      const { store } = user;

      expected = clone(storeInit);
      [0, 1, 3, 4].forEach(i => { expected[i].x = x; });
      assert.deepEqual(store, expected);
    });

    it('patches filtered, nondeleted items', async () => {
      const query = { key: 'a' };
      const x = 'x';
      const data = await user.patch(null, { x }, { query });

      let expected = [0, 1].map(index => merge(storeInit[index], { x }));
      assert.deepEqual(data, expected);

      const { store } = user;

      expected = clone(storeInit);
      [0, 1].forEach(i => { expected[i].x = x; });
      assert.deepEqual(store, expected);
    });
  });

  describe('remove, with id', () => {
    it('marks item as deleted', async () => {
      const removed = await user.remove(0);

      const { store } = user;

      assert.deepEqual(removed, merge(store[0], { deleted: true }));
    });

    it('throws if item already deleted', async () => {
      let err;
      try {
        await user.remove(2);
      } catch (e) {
        err = e;
      }

      assert(err, 'Error not thrown');
    });

    it('throws if item missing', async () => {
      let err;
      try {
        await user.remove(99);
      } catch (e) {
        err = e;
      }

      assert(err, 'Error not thrown');
    });
  });

  describe('remove, without id', () => {
    it('marks filtered items as deleted', async () => {
      const query = { key: 'a' };
      const removed = await user.remove(null, { query });

      const { store } = user;

      const shouldBe = [0, 1].map(index => merge(store[index], { deleted: true }));

      assert.deepEqual(removed, shouldBe);
    });

    it('handles nothing found', async () => {
      const query = { key: 'z' };

      const removed = await user.remove(null, { query });

      assert.deepEqual(removed, []);
    });
  });

  describe('handles params', () => {
    it('moves disable param from query to params', async () => {
      getCallParams = null;

      const params = { a: 1, b: 2, query: { $disableSoftDelete: true } };
      const expected = { a: 1, b: 2, $disableSoftDelete: true, query: {} };

      const data = await user.get(0, params);

      assert.deepEqual(data, storeInit['0']);
      assert.equal(user.get_call_count, 1);
      assert.deepEqual(afterSoftDeleteParams, expected);
    });

    it('uses all params for get', async () => {
      getCallParams = null;

      const params = { a: 1, b: 2 };
      const expected = { a: 1, b: 2, $disableSoftDelete: true, query: {} };

      const data = await user.get(0, params);

      assert.deepEqual(data, storeInit['0']);
      assert.equal(user.get_call_count, 1);
      assert.deepEqual(getCallParams, expected);
    });

    it('uses selected params for other methods', async () => {
      getCallParams = null;

      const params = { a: 1, b: 2, authenticated: 'a', user: 'b' };
      const expected = { $disableSoftDelete: true, authenticated: 'a', user: 'b', _populate: 'skip', query: {} };

      await user.patch(0, { x: 1 }, params);

      assert.equal(user.get_call_count, 1);
      assert.deepEqual(getCallParams, expected);
    });
  });
});
