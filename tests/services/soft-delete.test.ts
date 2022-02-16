// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('assert');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

const initialUsers = [
  { name: 'Jane Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a', deleted: true },
  { name: 'Rick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b', deleted: true }
];

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services softDelete', () => {
  let userService: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('find', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not return deleted items', async () => {
      const users = await userService.find();

      assert.deepStrictEqual(users, [
        { name: 'Jane Doe', key: 'a', id: 0 },
        { name: 'Jack Doe', key: 'a', id: 1 },
        { name: 'Rick Doe', key: 'b', id: 3 },
        { name: 'Mick Doe', key: 'b', id: 4 }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns an undeleted item', async () => {
      const user = await userService.get(0);

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws on deleted item', async () => {
      assert.rejects(async () => {
        await userService.get(2);
      }, {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns deleted when params.disableSoftDelete is set', async () => {
      const user = await userService.get(2, {
        disableSoftDelete: true
      });

      assert.deepStrictEqual(user, {
        name: 'Jack Doe', key: 'a', deleted: true, id: 2
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws on missing item', async () => {
      await assert.rejects(async () => {
        await userService.get(99);
      }, {
        name: 'NotFound',
        message: 'No record found for id \'99\''
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('update, with id', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates an undeleted item', async () => {
      const user = await userService.update(0, { y: 'y' });

      assert.deepStrictEqual(user, { y: 'y', id: 0 });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it.skip('throws on deleted item', async () => {
      await assert.rejects(async () => {
        await userService.update(2, { y: 'y' });
      }, {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('patch', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('patches an undeleted item', async () => {
      const user = await userService.patch(0, { y: 'y' });

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0, y: 'y'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws on deleted item', async () => {
      await assert.rejects(() => userService.patch(2, { y: 'y' }), {
        name: 'NotFound',
        message: 'No record found for id \'2\''
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('remove, with id', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('marks item as deleted', async () => {
      const user = await userService.remove(0);

      assert.deepStrictEqual(user, {
        name: 'Jane Doe', key: 'a', id: 0, deleted: true
      });

      await assert.rejects(() => userService.get(0), {
        name: 'NotFound'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws if item already deleted', async () => {
      await assert.rejects(() => userService.remove(2), {
        name: 'NotFound'
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('remove, without id', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('marks filtered items as deleted', async () => {
      const query = { key: 'a' };
      await userService.remove(null, { query });

      const users = await userService.find({ query });

      assert.strictEqual(users.length, 0);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('handles nothing found', async () => {
      const users = await userService.remove(null, { query: { key: 'z' } });

      assert.strictEqual(users.length, 0);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('with customization: deletedAt', () => {
    let peopleService: any;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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
            (context: any) => {
              context.data.deletedAt = null;
            }
          ]
        }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
