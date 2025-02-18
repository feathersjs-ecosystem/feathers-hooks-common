import assert from 'assert';
import { feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { createRelated } from './create-related';

type MockAppOptions = {
  multi?: boolean;
};

const defaultOptions = {
  multi: true,
};

const mockApp = (_options?: MockAppOptions) => {
  const options = Object.assign({}, defaultOptions, _options);
  const app = feathers();

  app.use('users', new MemoryService({ startId: 1, multi: true }));
  app.use('todos', new MemoryService({ startId: 1, multi: options.multi }));

  const usersService = app.service('users');
  const todosService = app.service('todos');

  return {
    app,
    todosService,
    usersService,
  };
};

describe('hook - createRelated', function () {
  it('creates single item for single item', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => ({
              title: 'First issue',
              userId: item.id,
            }),
          }),
        ],
      },
    });

    const user = await app.service('users').create({
      name: 'John Doe',
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 1, title: 'First issue', userId: 1 }]);
  });

  it('can use context in data function', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => ({
              title: context.path,
              userId: item.id,
            }),
          }),
        ],
      },
    });

    const user = await app.service('users').create({
      name: 'John Doe',
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 1, title: 'users', userId: 1 }]);
  });

  it('creates multiple items for multiple items', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => ({
              title: item.name,
              userId: item.id,
            }),
          }),
        ],
      },
    });

    const users = await app
      .service('users')
      .create([{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]);

    const todos = await todosService.find({ query: { $sort: { userId: 1 } } });

    assert.deepStrictEqual(todos, [
      { id: 1, title: 'user1', userId: 1 },
      { id: 2, title: 'user2', userId: 2 },
      { id: 3, title: 'user3', userId: 3 },
    ]);
  });

  it('creates multple items for multiple items with multi: false', async function () {
    const { app, todosService } = mockApp({ multi: false });

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => ({
              title: item.name,
              userId: item.id,
            }),
            multi: false,
          }),
        ],
      },
    });

    // @ts-expect-error - does not have options
    assert.strictEqual(todosService.options.multi, false);

    const users = await app
      .service('users')
      .create([{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]);

    const todos = await todosService.find({ query: { $sort: { userId: 1 } } });

    assert.deepStrictEqual(todos, [
      { id: 1, title: 'user1', userId: 1 },
      { id: 2, title: 'user2', userId: 2 },
      { id: 3, title: 'user3', userId: 3 },
    ]);
  });

  it('can create multiple data for one record', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => [
              {
                title: 1,
                userId: item.id,
              },
              {
                title: 2,
                userId: item.id,
              },
            ],
          }),
        ],
      },
    });

    const user = await app.service('users').create({
      name: 'John Doe',
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: 1, userId: 1 },
      { id: 2, title: 2, userId: 1 },
    ]);
  });

  it('can pass an array', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated([
            {
              service: 'todos',
              data: (item, context) => [
                {
                  title: 1,
                  userId: item.id,
                },
              ],
            },
            {
              service: 'todos',
              data: (item, context) => [
                {
                  title: 2,
                  userId: item.id,
                },
              ],
            },
          ]),
        ],
      },
    });

    const user = await app.service('users').create({
      name: 'John Doe',
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: 1, userId: 1 },
      { id: 2, title: 2, userId: 1 },
    ]);
  });

  it('does not create items if falsey', async function () {
    const { app, todosService } = mockApp();

    app.service('users').hooks({
      after: {
        create: [
          createRelated({
            service: 'todos',
            data: (item, context) => null as any,
          }),
        ],
      },
    });

    const user = await app.service('users').create({
      name: 'John Doe',
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, []);
  });
});
