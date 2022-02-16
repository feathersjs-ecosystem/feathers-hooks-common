
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('chai').assert;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BatchLoade... Remove this comment to see the full error message
const BatchLoader = require('@feathers-plus/batch-loader');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CacheMap'.
const CacheMap = require('@feathers-plus/cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cache'.
const { cache, fastJoin, iff, makeCallingParams } = require('../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getResults... Remove this comment to see the full error message
const { getResultsByKey, getUniqueKeys } = BatchLoader;

const postsStoreStartId = 5;
const postsStoreInit = [
  { id: 1, body: 'John post', userId: 101, starIds: [102, 103, 104] },
  { id: 2, body: 'Marshall post', userId: 102, starIds: [101, 103, 104] },
  { id: 3, body: 'Barbara post', userId: 103 },
  { id: 4, body: 'Aubree post', userId: 104 }
];

const usersStoreStartId = 105;
const usersStoreInit = [
  { id: 101, name: 'John' },
  { id: 102, name: 'Marshall' },
  { id: 103, name: 'Barbara' },
  { id: 104, name: 'Aubree' }
];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'app'.
let app;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'users'.
let users;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'posts'.
let posts: any;
let enableCache: any;
let joinAuthorCount: any;
let joinStarersCount: any;
let userBatchLoaderCount: any;

const cacheMapUsers = CacheMap({ max: 100 });
const userBatchLoader = new BatchLoader(async (keys: any, context: any) => {
  userBatchLoaderCount += 1;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
  const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
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

  class PostsService extends memory.Service {
    constructor (...args: any[]) {
      super(...args);
      this.foo = true;
    }

    get (...args: any[]) {
      return super.get(...args);
    }
  }

  app.use('/posts', new PostsService({ store, postsStoreStartId }));

  app.service('posts').hooks({
    before: {
      all: []
    }
  });
}

function usersService(this: any) {
  const app = this;
  const store = clone(usersStoreInit);

  class UsersService extends memory.Service {
    constructor (...args: any[]) {
      super(...args);
      this.junk = true;
    }

    get (...args: any[]) {
      return super.get(...args);
    }
  }

  app.use('/users', new UsersService({ store, usersStoreStartId }));

  app.service('users').hooks({
    before: {
      all: iff(enableCache, cache(cacheMapUsers))
    },
    after: {
      all: iff(enableCache, cache(cacheMapUsers))
    }
  });
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services fastJoin & cache', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2588) FIXME: Cannot assign to 'app' because it is a constant.
    app = feathers()
      .configure(services);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type '{ a: st... Remove this comment to see the full error message
    posts = app.service('posts');
    // @ts-expect-error ts-migrate(2539) FIXME: Cannot assign to 'users' because it is not a varia... Remove this comment to see the full error message
    users = app.service('users');

    enableCache = false;
    joinAuthorCount = 0;
    joinStarersCount = 0;
    userBatchLoaderCount = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('check services work', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('find posts', async () => {
      const data = await posts.find();
      assert.deepEqual(data, postsStoreInit);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('find users', async () => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
      const data = await users.find();
      assert.deepEqual(data, usersStoreInit);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('test fastJoin', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('no cacheMap, no cache hook', async () => {
      const context = await ex8();

      const result = {
        method: 'find',
        result:
        [{
          id: 1,
          body: 'John post',
          userId: 101,
          starIds: [102, 103, 104],
          author: { id: 101, name: 'John' },
          starers:
          [{ id: 102, name: 'Marshall' },
            { id: 103, name: 'Barbara' },
            { id: 104, name: 'Aubree' }]
        }],
        params: {},
        _loaders: undefined
      };

      assert.deepEqual(context, result);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('with cacheMap, no cache hook', async () => {
      const context = await ex8a();

      const result = {
        method: 'find',
        result:
        [{
          id: 1,
          body: 'John post',
          userId: 101,
          starIds: [102, 103, 104],
          author: { id: 101, name: 'John' },
          starers:
          [{ id: 102, name: 'Marshall' },
            { id: 103, name: 'Barbara' },
            { id: 104, name: 'Aubree' }]
        }],
        params: {},
        _loaders: undefined
      };

      assert.deepEqual(context, result);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('test fastJoin with cacheMap & cache', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      enableCache = true;
      cacheMapUsers.reset();
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works for 1 call', async () => {
      const context = await ex8b();

      const result = {
        method: 'find',
        result:
        [{
          id: 1,
          body: 'John post',
          userId: 101,
          starIds: [102, 103, 104],
          author: { id: 101, name: 'John' },
          starers:
          [{ id: 102, name: 'Marshall' },
            { id: 103, name: 'Barbara' },
            { id: 104, name: 'Aubree' }]
        }],
        params: {},
        _loaders: undefined
      };

      assert.deepEqual(context, result);
      assert.equal(joinAuthorCount, 1, 'joinAuthorCount');
      assert.equal(joinStarersCount, 1, 'joinStarersCount');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses persistent cache for 2 calls', async () => {
      assert.equal(cacheMapUsers.itemCount, 0, '0 cache');

      const result = {
        method: 'find',
        result:
        [{
          id: 1,
          body: 'John post',
          userId: 101,
          starIds: [102, 103, 104],
          author: { id: 101, name: 'John' },
          starers:
          [{ id: 102, name: 'Marshall' },
            { id: 103, name: 'Barbara' },
            { id: 104, name: 'Aubree' }]
        }],
        params: {},
        _loaders: undefined
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

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function ex8 () {
  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = new BatchLoader(async (keys: any, context: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
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
      }
    }
  };

  const context = { method: 'find', result: clone(await posts.find({ query: { id: 1 } })), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex8a () {
  const cacheMap = CacheMap({ max: 100 });

  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = new BatchLoader(async (keys: any, context: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
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
      }
    }
  };

  const context = { method: 'find', result: clone(await posts.find({ query: { id: 1 } })), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex8b () {
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
      }
    }
  };

  const context = { method: 'find', result: clone(await posts.find({ query: { id: 1 } })), params: {} };

  return fastJoin(postResolvers)(context);
}

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
