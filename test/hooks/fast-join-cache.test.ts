import { assert } from 'chai';
import { feathers } from '@feathersjs/feathers';
import BatchLoader from '@feathers-plus/batch-loader';
// @ts-ignore
import CacheMap from '@feathers-plus/cache';
import { Service } from 'feathers-memory';
import { cache, fastJoin, iff, makeCallingParams } from '../../src';

const { getResultsByKey, getUniqueKeys } = BatchLoader;

const postsStoreStartId = 5;
const postsStoreInit = [
  { id: 1, body: 'John post', userId: 101, starIds: [102, 103, 104] },
  { id: 2, body: 'Marshall post', userId: 102, starIds: [101, 103, 104] },
  { id: 3, body: 'Barbara post', userId: 103 },
  { id: 4, body: 'Aubree post', userId: 104 },
];

const usersStoreStartId = 105;
const usersStoreInit = [
  { id: 101, name: 'John' },
  { id: 102, name: 'Marshall' },
  { id: 103, name: 'Barbara' },
  { id: 104, name: 'Aubree' },
];

let app: any;
let users: any;
let posts: any;
let enableCache: any;
let joinAuthorCount: any;
let joinStarersCount: any;
let userBatchLoaderCount: any;

const cacheMapUsers = CacheMap({ max: 100 });
const userBatchLoader = new BatchLoader(
  async (keys: any, context: any) => {
    userBatchLoaderCount += 1;
    const result: any = await users.find(
      makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } })
    );
    return getResultsByKey(keys, result, (user: any) => user.id, '!');
  },
  { context: {}, cacheMap: cacheMapUsers }
);

function services(this: any) {
  const app = this;
  app.configure(usersService);
  app.configure(postsService);
}

function postsService(this: any) {
  const app = this;
  const store = clone(postsStoreInit);

  class PostsService extends Service {
    foo: boolean;

    constructor(...args: any[]) {
      super(...args);
      this.foo = true;
    }

    get(...args: any[]) {
      // @ts-ignore
      return super.get(...args);
    }
  }

  app.use('/posts', new PostsService({ store, postsStoreStartId }));

  app.service('posts').hooks({
    before: {
      all: [],
    },
  });
}

function usersService(this: any) {
  const app = this;
  const store = clone(usersStoreInit);

  class UsersService extends Service {
    junk: boolean;
    constructor(...args: any[]) {
      super(...args);
      this.junk = true;
    }

    get(...args: any[]) {
      // @ts-ignore
      return super.get(...args);
    }
  }

  app.use('/users', new UsersService({ store, usersStoreStartId }));

  app.service('users').hooks({
    before: {
      all: iff(enableCache, cache(cacheMapUsers)),
    },
    after: {
      all: iff(enableCache, cache(cacheMapUsers)),
    },
  });
}

describe('services fastJoin & cache', () => {
  beforeEach(() => {
    app = feathers().configure(services);

    posts = app.service('posts');
    users = app.service('users');

    enableCache = false;
    joinAuthorCount = 0;
    joinStarersCount = 0;
    userBatchLoaderCount = 0;
  });

  describe('check services work', () => {
    it('find posts', async () => {
      const data = await posts.find();
      assert.deepEqual(data, postsStoreInit);
    });

    it('find users', async () => {
      const data = await users.find();
      assert.deepEqual(data, usersStoreInit);
    });
  });

  describe('test fastJoin', () => {
    it('no cacheMap, no cache hook', async () => {
      const context = await ex8();

      const result: any = {
        method: 'find',
        result: [
          {
            id: 1,
            body: 'John post',
            userId: 101,
            starIds: [102, 103, 104],
            author: { id: 101, name: 'John' },
            starers: [
              { id: 102, name: 'Marshall' },
              { id: 103, name: 'Barbara' },
              { id: 104, name: 'Aubree' },
            ],
          },
        ],
        params: {},
        _loaders: undefined,
      };

      assert.deepEqual(context, result);
    });

    it('with cacheMap, no cache hook', async () => {
      const context = await ex8a();

      const result: any = {
        method: 'find',
        result: [
          {
            id: 1,
            body: 'John post',
            userId: 101,
            starIds: [102, 103, 104],
            author: { id: 101, name: 'John' },
            starers: [
              { id: 102, name: 'Marshall' },
              { id: 103, name: 'Barbara' },
              { id: 104, name: 'Aubree' },
            ],
          },
        ],
        params: {},
        _loaders: undefined,
      };

      assert.deepEqual(context, result);
    });
  });

  describe('test fastJoin with cacheMap & cache', () => {
    beforeEach(() => {
      enableCache = true;
      cacheMapUsers.reset();
    });

    it('works for 1 call', async () => {
      const context = await ex8b();

      const result: any = {
        method: 'find',
        result: [
          {
            id: 1,
            body: 'John post',
            userId: 101,
            starIds: [102, 103, 104],
            author: { id: 101, name: 'John' },
            starers: [
              { id: 102, name: 'Marshall' },
              { id: 103, name: 'Barbara' },
              { id: 104, name: 'Aubree' },
            ],
          },
        ],
        params: {},
        _loaders: undefined,
      };

      assert.deepEqual(context, result);
      assert.equal(joinAuthorCount, 1, 'joinAuthorCount');
      assert.equal(joinStarersCount, 1, 'joinStarersCount');
    });

    it('uses persistent cache for 2 calls', async () => {
      assert.equal(cacheMapUsers.itemCount, 0, '0 cache');

      const result: any = {
        method: 'find',
        result: [
          {
            id: 1,
            body: 'John post',
            userId: 101,
            starIds: [102, 103, 104],
            author: { id: 101, name: 'John' },
            starers: [
              { id: 102, name: 'Marshall' },
              { id: 103, name: 'Barbara' },
              { id: 104, name: 'Aubree' },
            ],
          },
        ],
        params: {},
        _loaders: undefined,
      };
      // First call
      let context = await ex8b();

      assert.deepEqual(context, result);
      assert.equal(cacheMapUsers.itemCount, 4, '1 cache');
      assert.equal(joinAuthorCount, 1, '1 joinAuthorCount');
      assert.equal(joinStarersCount, 1, '1 joinStarersCount');
      assert.equal(userBatchLoaderCount, 1, '1 userBatchLoaderCount');

      // Second call
      joinAuthorCount = 0;
      joinStarersCount = 0;
      userBatchLoaderCount = 0;

      context = await ex8b();

      assert.deepEqual(context, result);
      assert.equal(cacheMapUsers.itemCount, 4, '2 cache');
      assert.equal(joinAuthorCount, 1, '2 joinAuthorCount');
      assert.equal(joinStarersCount, 1, '2 joinStarersCount');
      assert.equal(userBatchLoaderCount, 0, '2 userBatchLoaderCount'); // key check
    });
  });
});

async function ex8() {
  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = new BatchLoader(
        async (keys: any, context: any) => {
          const result = await users.find(
            makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } })
          );
          return getResultsByKey(keys, result, (user: any) => user.id, '!');
        },
        { context }
      );
    },

    joins: {
      author: () => async (post: any, context: any) => {
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post: any, context: any) => {
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      },
    },
  };

  const context: any = {
    method: 'find',
    result: clone(await posts.find({ query: { id: 1 } })),
    params: {},
  };

  return fastJoin(postResolvers)(context);
}

async function ex8a() {
  const cacheMap = CacheMap({ max: 100 });

  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = new BatchLoader(
        async (keys: any, context: any) => {
          const result = await users.find(
            makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } })
          );
          return getResultsByKey(keys, result, (user: any) => user.id, '!');
        },
        { context, cacheMap }
      );
    },

    joins: {
      author: () => async (post: any, context: any) => {
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post: any, context: any) => {
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      },
    },
  };

  const context: any = {
    method: 'find',
    result: clone(await posts.find({ query: { id: 1 } })),
    params: {},
  };

  return fastJoin(postResolvers)(context);
}

async function ex8b() {
  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = userBatchLoader;
    },

    joins: {
      author: () => async (post: any, context: any) => {
        joinAuthorCount += 1;
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post: any, context: any) => {
        joinStarersCount += 1;
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      },
    },
  };

  const context: any = {
    method: 'find',
    result: clone(await posts.find({ query: { id: 1 } })),
    params: {},
  };

  return fastJoin(postResolvers)(context);
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
