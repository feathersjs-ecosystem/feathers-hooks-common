const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const hooks = require('../../lib/services');

const initialUsers = [
  { name: 'Jane Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a', deleted: true },
  { name: 'Rick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b', deleted: true }
];

describe('services softDelete', () => {
  let userService;

  beforeEach(() => {
    const app = feathers()
      .use('/users', memory({
        multi: ['create', 'patch', 'remove']
      }));

    userService = app.service('users');
    userService.hooks({
      before: {
        all: [
          hooks.softDelete()
        ]
      }
    });

    userService.create(initialUsers);
  });

  it('throws error on wrong app version', async () => {
    const app = feathers()
      .use('/users', memory());

    app.service('users').hooks({
      before: {
        all: [
          hooks.softDelete()
        ]
      }
    });

    app.version = '3.1.4';

    await assert.rejects(() => app.service('users').find(), {
      message: 'The softDelete hook requires Feathers 4.0.0 or later'
    });
  });

  describe('find', () => {
    it('does not return deleted items', async () => {
      const users = await userService.find();

      assert.deepStrictEqual(users, [
        { name: 'Jane Doe', key: 'a', id: 0 },
        { name: 'Jack Doe', key: 'a', id: 1 },
        { name: 'Rick Doe', key: 'b', id: 3 },
        { name: 'Mick Doe', key: 'b', id: 4 }
      ]);
    });

    it('returns everything with params.disableSoftdelete', async () => {
      const users = await userService.find({
        disableSoftDelete: true
      });

      assert.deepStrictEqual(users, [
        { name: 'Jane Doe', key: 'a', id: 0 },
        { name: 'Jack Doe', key: 'a', id: 1 },
        { name: 'Jack Doe', key: 'a', deleted: true, id: 2 },
        { name: 'Rick Doe', key: 'b', id: 3 },
        { name: 'Mick Doe', key: 'b', id: 4 },
        { name: 'Mick Doe', key: 'b', deleted: true, id: 5 }
      ]);
    });
  });

  describe('get', () => {
    it('returns an undeleted item', async () => {
      const user = await userService.get(0);

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0
      });
    });

    it('throws on deleted item', async () => {
      assert.rejects(async () => {
        await userService.get(2);
      }, {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });

    it('returns deleted when params.disableSoftDelete is set', async () => {
      const user = await userService.get(2, {
        disableSoftDelete: true
      });

      assert.deepStrictEqual(user, {
        name: 'Jack Doe', key: 'a', deleted: true, id: 2
      });
    });

    it('throws on missing item', async () => {
      await assert.rejects(async () => {
        await userService.get(99);
      }, {
        name: 'NotFound',
        message: 'No record found for id \'99\''
      });
    });
  });

  describe('update, with id', () => {
    it('updates an undeleted item', async () => {
      const user = await userService.update(0, { y: 'y' });

      assert.deepStrictEqual(user, { y: 'y', id: 0 });
    });

    it.skip('throws on deleted item', async () => {
      await assert.rejects(async () => {
        await userService.update(2, { y: 'y' });
      }, {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });
  });

  describe('patch', () => {
    it('patches an undeleted item', async () => {
      const user = await userService.patch(0, { y: 'y' });

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0, y: 'y'
      });
    });

    it('throws on deleted item', async () => {
      await assert.rejects(() => userService.patch(2, { y: 'y' }), {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });

    it('multi updates on undeleted items', async () => {
      const patched = await userService.patch(null, { x: 'x' });

      assert.deepStrictEqual(patched, [
        { name: 'Jane Doe', key: 'a', id: 0, x: 'x' },
        { name: 'Jack Doe', key: 'a', id: 1, x: 'x' },
        { name: 'Rick Doe', key: 'b', id: 3, x: 'x' },
        { name: 'Mick Doe', key: 'b', id: 4, x: 'x' }
      ]);
    });
  });

  describe('remove, with id', () => {
    it('marks item as deleted', async () => {
      const user = await userService.remove(0);

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0, deleted: true
      });

      await assert.rejects(() => userService.get(0), {
        name: 'NotFound'
      });
    });

    it('throws if item already deleted', async () => {
      await assert.rejects(() => userService.remove(2), {
        name: 'NotFound'
      });
    });
  });

  describe('remove, without id', () => {
    it('marks filtered items as deleted', async () => {
      const query = { key: 'a' };
      await userService.remove(null, { query });

      const users = await userService.find({ query });

      assert.strictEqual(users.length, 0);
    });

    it('handles nothing found', async () => {
      const users = await userService.remove(null, { query: { key: 'z' } });

      assert.strictEqual(users.length, 0);
    });
  });

  describe('with customization: deletedAt', () => {
    let peopleService;

    beforeEach(() => {
      const app = feathers()
        .use('/people', memory({
          multi: ['create', 'patch', 'remove']
        }));

      peopleService = app.service('people');
      peopleService.hooks({
        before: {
          all: [
            hooks.softDelete({
              deletedQuery: async () => {
                return { deletedAt: null };
              },
              removeData: async () => {
                return { deletedAt: new Date() };
              }
            })
          ],
          create: [
            context => {
              context.data.deletedAt = null;
            }
          ]
        }
      });
    });

    it('works with setting deletedAt to date', async () => {
      const user = await peopleService.create({ name: 'Jon Doe' });
      const deletedUser = await peopleService.remove(user.id);

      assert.ok(deletedUser.deletedAt !== null);

      await assert.rejects(() => peopleService.get(user.id), {
        name: 'NotFound'
      });
    });
  });
});
