import assert from 'assert';
import { feathers } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { setField } from '../../src';

import type { Application } from '@feathersjs/feathers';

describe('setField', () => {
  const user = {
    id: 1,
    name: 'David',
  };

  let app: Application;

  describe('around', () => {
    beforeEach(async () => {
      app = feathers();
      app.use('/messages', memory());
      app.service('messages').hooks({});
      await app.service('messages').create({
        id: 1,
        text: 'Message 1',
        userId: 1,
      });
      await app.service('messages').create({
        id: 2,
        text: 'Message 2',
        userId: 2,
      });
    });
  });

  describe('regular hooks', () => {
    beforeEach(async () => {
      app = feathers();
      app.use('/messages', memory());
      app.service('messages').hooks({
        before: {
          all: [
            setField({
              from: 'params.user.id',
              as: 'params.query.userId',
            }),
          ],
        },
      });
      await app.service('messages').create({
        id: 1,
        text: 'Message 1',
        userId: 1,
      });
      await app.service('messages').create({
        id: 2,
        text: 'Message 2',
        userId: 2,
      });
    });

    it('errors when options not set', () => {
      assert.throws(() =>
        // @ts-expect-error
        setField()
      );
      assert.throws(() =>
        // @ts-expect-error
        setField({ as: 'me' })
      );
      assert.throws(() =>
        // @ts-expect-error
        setField({ from: 'you' })
      );
    });

    it('find queries with user information, does not modify original objects', async () => {
      const query = {};
      // @ts-ignore
      const results = await app.service('messages').find({ query, user });

      assert.equal(results.length, 1);
      assert.deepEqual(query, {});
    });

    it('adds user information to get, throws NotFound event if record exists', async () => {
      await assert.rejects(
        async () => {
          // @ts-ignore
          await app.service('messages').get(2, { user });
        },
        {
          name: 'NotFound',
          message: "No record found for id '2'",
        }
      );

      // @ts-ignore
      const result = await app.service('messages').get(1, { user });

      assert.deepEqual(result, {
        id: 1,
        text: 'Message 1',
        userId: 1,
      });
    });

    it('does nothing on internal calls if value does not exists', async () => {
      const results = await app.service('messages').find();

      assert.equal(results.length, 2);
    });

    it('errors on external calls if value does not exists', async () => {
      await assert.rejects(
        async () => {
          await app.service('messages').find({
            provider: 'rest',
          });
        },
        {
          name: 'Forbidden',
          message: 'Expected field params.query.userId not available',
        }
      );
    });

    it('errors when not used as a before hook', async () => {
      app.service('messages').hooks({
        after: {
          get: setField({
            from: 'params.user.id',
            as: 'params.query.userId',
          }),
        },
      });

      await assert.rejects(
        async () => {
          await app.service('messages').get(1);
        },
        {
          message: "The 'setField' hook can only be used as a 'before,around' hook.",
        }
      );
    });
  });
});
