import { assert, expect } from 'vitest';
import { Application, feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { stashBefore } from './stash-before';
import { clone } from '../../common';

const startId = 6;
const storeInit = {
  0: { name: 'Jane Doe', key: 'a', id: 0 },
  1: { name: 'Jack Doe', key: 'a', id: 1 },
  2: { name: 'John Doe', key: 'a', id: 2 },
  3: { name: 'Rick Doe', key: 'b', id: 3 },
  4: { name: 'Dick Doe', key: 'b', id: 4 },
  5: { name: 'Dork Doe', key: 'b', id: 5 },
};

let store;
let finalParams: any;
let innerCallParams: any;

function services(app: Application) {
  app.configure(users);
}

function users(app: Application) {
  store = clone(storeInit);

  app.use(
    'users',
    new MemoryService({
      store,
      startId,
      multi: true,
    }),
  );

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
        },
      ],
    },
  });
}

describe('stash-before', () => {
  let app: Application<{ users: MemoryService }>;
  let users: any;

  beforeEach(() => {
    innerCallParams = finalParams = null;

    app = feathers().configure(services);

    users = app.service('users');
  });

  it(`stashes on 'update'`, async () => {
    await users.update(0, {});

    assert.deepEqual(finalParams.before, storeInit[0]);
  });

  it(`stashes on 'patch'`, async () => {
    await users.patch(0, {});

    assert.deepEqual(finalParams.before, storeInit[0]);
  });

  it(`stashes on 'remove'`, async () => {
    await users.remove(0);

    assert.deepEqual(finalParams.before, storeInit[0]);
  });

  it("throws on 'create'", async () => {
    await expect(users.create({})).rejects.toThrow();
  });

  it("throws on 'find'", async () => {
    await expect(users.find({})).rejects.toThrow();
  });

  it("throws on 'get'", async () => {
    await expect(users.get(0)).rejects.toThrow();
  });

  it('stashes on patch with custom params', async () => {
    await users.patch(0, {}, { provider: 'socketio', eyecatcher: -1 });

    assert.equal(finalParams.provider, 'socketio');
    assert.equal(finalParams.eyecatcher, -1);

    assert.equal(innerCallParams.provider, 'socketio');
    assert.property(innerCallParams, 'eyecatcher');
  });

  it('stashes multi patch', async () => {
    const items = [storeInit[0], storeInit[1], storeInit[2]];
    await users.patch(null, { key: 'c' }, { query: { id: { $in: items.map(x => x.id) } } });

    assert.deepEqual(finalParams.before, items);
  });

  it('stashes multi remove', async () => {
    const items = [storeInit[0], storeInit[1], storeInit[2]];
    await users.remove(null, { query: { id: { $in: items.map(x => x.id) } } });

    assert.deepEqual(finalParams.before, items);
  });
});
