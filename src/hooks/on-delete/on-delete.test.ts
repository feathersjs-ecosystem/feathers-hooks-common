import assert from 'assert';
import { feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { onDelete } from './on-delete';

const mockApp = () => {
  const app = feathers();

  app.use('users', new MemoryService({ startId: 1, multi: true }));
  app.use('todos', new MemoryService({ startId: 1, multi: true }));
  app.use('tasks', new MemoryService({ startId: 1, multi: true }));

  const usersService = app.service('users');
  const todosService = app.service('todos');
  const tasksService = app.service('tasks');

  return {
    app,
    todosService,
    usersService,
    tasksService,
  };
};

describe('hook - onDelete', function () {
  describe('cascade', function () {
    it('removes single item for single item', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      const user = await usersService.create({
        name: 'John Doe',
      });

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: user.id,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      await usersService.remove(user.id);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [{ id: 2, title: 'Buy eggs', userId: 2 }]);
    });

    it('removes multiple items for single item', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      const user = await usersService.create({
        name: 'John Doe',
      });

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: user.id,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: user.id,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(user.id);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [{ id: 3, title: 'Buy bread', userId: 3 }]);
    });

    it('removes single item for multiple items', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 1,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(1);

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jack Doe' },
      ]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 2, title: 'Buy eggs', userId: 2 },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });

    it('removes multiple items for multiple items', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 1,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(null, { query: { id: { $in: [1, 2] } } });

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [{ id: 3, name: 'Jack Doe' }]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [{ id: 3, title: 'Buy bread', userId: 3 }]);
    });

    it('does not remove items if not found', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 2,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(1);

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jack Doe' },
      ]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: 2 },
        { id: 2, title: 'Buy eggs', userId: 2 },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });

    it('can pass an array', async function () {
      const { app, usersService, todosService, tasksService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete([
              {
                service: 'todos',
                keyThere: 'userId',
                keyHere: 'id',
                onDelete: 'cascade',
                blocking: true,
              },
              {
                service: 'tasks',
                keyThere: 'userId',
                keyHere: 'id',
                onDelete: 'cascade',
                blocking: true,
              },
            ]),
          ],
        },
      });

      const user = await usersService.create({
        name: 'John Doe',
      });

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: user.id,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const task = await tasksService.create({
        title: 'Buy milk task',
        userId: user.id,
      });

      const task2 = await tasksService.create({
        title: 'Buy eggs task',
        userId: 2,
      });

      await usersService.remove(user.id);

      const todos = await todosService.find({ query: {} });
      assert.deepStrictEqual(todos, [{ id: 2, title: 'Buy eggs', userId: 2 }]);

      const tasks = await tasksService.find({ query: {} });
      assert.deepStrictEqual(tasks, [{ id: 2, title: 'Buy eggs task', userId: 2 }]);
    });
  });

  describe('set null', function () {
    it('sets null single item for single item', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'set null',
              blocking: true,
            }),
          ],
        },
      });

      const user = await usersService.create({
        name: 'John Doe',
      });

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: user.id,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      await usersService.remove(user.id);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: null },
        { id: 2, title: 'Buy eggs', userId: 2 },
      ]);
    });

    it('sets null multiple items for single item', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'set null',
              blocking: true,
            }),
          ],
        },
      });

      const user = await usersService.create({
        name: 'John Doe',
      });

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: user.id,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: user.id,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(user.id);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: null },
        { id: 2, title: 'Buy eggs', userId: null },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });

    it('sets null single item for multiple items', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'set null',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 1,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(1);

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jack Doe' },
      ]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: null },
        { id: 2, title: 'Buy eggs', userId: 2 },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });

    it('sets null multiple items for multiple items', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'set null',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 1,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(null, { query: { id: { $in: [1, 2] } } });

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [{ id: 3, name: 'Jack Doe' }]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: null },
        { id: 2, title: 'Buy eggs', userId: null },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });

    it('does not set null for items if not found', async function () {
      const { app, usersService, todosService } = mockApp();

      usersService.hooks({
        after: {
          remove: [
            onDelete({
              service: 'todos',
              keyThere: 'userId',
              keyHere: 'id',
              onDelete: 'cascade',
              blocking: true,
            }),
          ],
        },
      });

      await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jack Doe' }]);

      const todo = await todosService.create({
        title: 'Buy milk',
        userId: 2,
      });

      const todo2 = await todosService.create({
        title: 'Buy eggs',
        userId: 2,
      });

      const todo3 = await todosService.create({
        title: 'Buy bread',
        userId: 3,
      });

      await usersService.remove(1);

      const users = await usersService.find({ query: {} });

      assert.deepStrictEqual(users, [
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jack Doe' },
      ]);

      const todos = await todosService.find({ query: {} });

      assert.deepStrictEqual(todos, [
        { id: 1, title: 'Buy milk', userId: 2 },
        { id: 2, title: 'Buy eggs', userId: 2 },
        { id: 3, title: 'Buy bread', userId: 3 },
      ]);
    });
  });
});
