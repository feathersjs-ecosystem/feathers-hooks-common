import { assert, expect } from 'vitest';
import { feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { setField } from './set-field';

import type { Application } from '@feathersjs/feathers';

describe('setField', () => {
  const user = {
    id: 1,
    name: 'David',
  };

  let app: Application;

  beforeEach(async () => {
    app = feathers();
    app.use('/messages', new MemoryService());
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
      app.service('messages').hooks({
        before: {
          // @ts-expect-error
          get: setField(),
        },
      }),
    );
    assert.throws(() =>
      app.service('messages').hooks({
        before: {
          // @ts-expect-error
          get: setField({ as: 'me' }),
        },
      }),
    );
    assert.throws(() =>
      app.service('messages').hooks({
        before: {
          // @ts-expect-error
          get: setField({ from: 'you' }),
        },
      }),
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
    await expect(async () => {
      // @ts-ignore
      await app.service('messages').get(2, { user });
    }).rejects.toThrow();

    // @ts-ignore
    const result = await app.service('messages').get(1, { user });

    assert.deepEqual(result, {
      id: 1,
      text: 'Message 1',
      userId: 1,
    } as any);
  });

  it('does nothing on internal calls if value does not exists', async () => {
    const results = await app.service('messages').find();

    assert.equal(results.length, 2);
  });

  it('errors on external calls if value does not exists', async () => {
    await expect(async () => {
      await app.service('messages').find({
        provider: 'rest',
      });
    }).rejects.toThrow();
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

    await expect(async () => {
      await app.service('messages').get(1);
    }).rejects.toThrow();
  });
});
