
const { assert } = require('chai');
const BatchLoader = require('@feathers-plus/batch-loader');
const { fastJoin, makeCallingParams } = require('../lib/index');

const { posts, users, comments } = require('../tests/helpers/make-services');

const { getResultsByKey, getUniqueKeys, loaderFactory } = BatchLoader;

describe('service fast-join', () => {
  it('Guide - resolvers', async () => {
    const context = await ex1();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        author: { id: 101, name: 'John' },
        starers: [{ name: 'Marshall' }, { name: 'Barbara' }, { name: 'Aubree' }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - shaping the result', async () => {
    const context = await ex2();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        author: { id: 101, name: 'John' }
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - Customize Resolver Operation', async () => {
    const context = await ex3();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        author: { id: 101, name: 'John' },
        starers: [
          { id: 102, name: 'Marshall' },
          { id: 103, name: 'Barbara' },
          { id: 104, name: 'Aubree' }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - Calculated Fields', async () => {
    const context = await ex4();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        starerCount: 3,
        author: { id: 101, name: 'John' },
        starers: [{ name: 'Marshall' }, { name: 'Barbara' }, { name: 'Aubree' }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - Recursive Operations', async () => {
    const context = await ex5();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        comments:
        [{
          id: 11,
          text: 'John post Marshall comment 11',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 12,
          text: 'John post Marshall comment 12',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 13,
          text: 'John post Marshall comment 13',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - Keeping Resolvers DRY', async () => {
    const context = await ex6();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
        comments:
        [{
          id: 11,
          text: 'John post Marshall comment 11',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 12,
          text: 'John post Marshall comment 12',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 13,
          text: 'John post Marshall comment 13',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });

  it('Guide - Using a Simple Batch-Loader', async () => {
    const context = await ex7();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
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

  it('Guide - Using Batch-Loaders', async () => {
    const context = await ex8();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1 },
          { userId: 103, points: 1 },
          { userId: 104, points: 1 }],
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

  it('Guide - Putting It All Together', async () => {
    const context = await ex9();
    const result = {
      method: 'find',
      result:
      [{
        id: 1,
        body: 'John post',
        userId: 101,
        starIds: [102, 103, 104],
        reputation:
        [{ userId: 102, points: 1, author: 'Marshall' },
          { userId: 103, points: 1, author: 'Barbara' },
          { userId: 104, points: 1, author: 'Aubree' }],
        author: { id: 101, name: 'John' },
        starers:
        [{ id: 102, name: 'Marshall' },
          { id: 103, name: 'Barbara' },
          { id: 104, name: 'Aubree' }],
        comments:
        [{
          id: 11,
          text: 'John post Marshall comment 11',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 12,
          text: 'John post Marshall comment 12',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        },
        {
          id: 13,
          text: 'John post Marshall comment 13',
          postId: 1,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        }]
      },
      {
        id: 2,
        body: 'Marshall post',
        userId: 102,
        starIds: [101, 103, 104],
        author: { id: 102, name: 'Marshall' },
        starers:
        [{ id: 101, name: 'John' },
          { id: 103, name: 'Barbara' },
          { id: 104, name: 'Aubree' }],
        comments:
        [{
          id: 14,
          text: 'Marshall post John comment 14',
          postId: 2,
          userId: 101,
          author: { id: 101, name: 'John' }
        },
        {
          id: 15,
          text: 'Marshall post John comment 15',
          postId: 2,
          userId: 101,
          author: { id: 101, name: 'John' }
        }]
      },
      {
        id: 3,
        body: 'Barbara post',
        userId: 103,
        author: { id: 103, name: 'Barbara' },
        comments:
        [{
          id: 16,
          text: 'Barbara post John comment 16',
          postId: 3,
          userId: 101,
          author: { id: 101, name: 'John' }
        }]
      },
      {
        id: 4,
        body: 'Aubree post',
        userId: 104,
        author: { id: 104, name: 'Aubree' },
        comments:
        [{
          id: 17,
          text: 'Aubree post Marshall comment 17',
          postId: 4,
          userId: 102,
          author: { id: 102, name: 'Marshall' }
        }]
      }],
      params: {},
      _loaders: undefined
    };

    assert.deepEqual(context, result);
  });
});

async function ex1 () {
  const postResolvers = {
    joins: {
      author: () => async post => {
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: $select => async post => {
        post.starers = await users.find({
          query: {
            id: { $in: post.starIds }, $select: $select || ['name']
          }
        });
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex2 () {
  const postResolvers = {
    joins: {
      author: () => async post => {
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: $select => async post => {
        post.starers = await users.find({
          query: {
            id: { $in: post.starIds }, $select: $select || ['name']
          }
        });
      }
    }
  };

  const query = {
    author: true
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers, context => query)(context);
}

async function ex3 () {
  const postResolvers = {
    joins: {
      author: () => async post => {
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: $select => async post => {
        post.starers = await users.find({
          query: {
            id: { $in: post.starIds }, $select: $select || ['name']
          }
        });
      }
    }
  };

  const query = {
    author: true,
    starers: [['id', 'name']]
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(context => postResolvers, context => query)(context);
}

async function ex4 () {
  const postResolvers = {
    joins: {
      author: () => async post => {
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: $select => async post => {
        post.starers = await users.find({
          query: {
            id: { $in: post.starIds }, $select: $select || ['name']
          }
        });
      },
      starerCount: () => post => { post.starerCount = post.starIds.length; }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex5 () {
  const postResolvers = {
    joins: {
      comments: {
        resolver: ($select, $limit, $sort) => async post => {
          post.comments = await comments.find({
            query: {
              postId: post.id, $select: $select, $limit: $limit || 5, [$sort]: { createdAt: -1 }
            }
          });
          return post.comments;
        },
        joins: {
          author: $select => async comment => {
            comment.author = (await users.find({
              query: {
                id: comment.userId, $select: $select
              }
            }))[0];
          }
        }
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex6 () {
  const commentResolvers = {
    joins: {
      author: $select => async comment => {
        comment.author = (await users.find({
          query: {
            id: comment.userId
          }
        }))[0];
      }
    }
  };

  const postResolvers = {
    joins: {
      comments: {
        resolver: ($select, $limit, $sort) => async post => {
          post.comments = await comments.find({
            query: {
              postId: post.id, $select: $select, $limit: $limit || 5, [$sort]: { createdAt: -1 }
            }
          });
          return post.comments;
        },
        joins: commentResolvers
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex7 () {
  const postResolvers = {
    before: context => {
      context._loaders = { user: {} };

      context._loaders.user.id = loaderFactory(users, 'id', false)(context);
    },

    joins: {
      author: () => async (post, context) => {
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post, context) => {
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex8 () {
  const postResolvers = {
    before: context => {
      context._loaders = { user: {} };

      context._loaders.user.id = new BatchLoader(async (keys, context) => {
        const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
        return getResultsByKey(keys, result, user => user.id, '!');
      },
      { context }
      );
    },

    joins: {
      author: () => async (post, context) => {
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post, context) => {
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex9 () {
  const commentResolvers = {
    joins: {
      author: () => async (comment, context) => {
        if (!comment.userId) return;
        comment.author = await context._loaders.user.id.load(comment.userId);
      }
    }
  };

  const postResolvers = {
    before: context => {
      context._loaders = { user: {}, comments: {} };

      context._loaders.user.id = new BatchLoader(async (keys, context) => {
        const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
        return getResultsByKey(keys, result, user => user.id, '!');
      },
      { context }
      );

      context._loaders.comments.postId = new BatchLoader(async (keys, context) => {
        const result = await comments.find(makeCallingParams(context, { postId: { $in: getUniqueKeys(keys) } }));
        return getResultsByKey(keys, result, comment => comment.postId, '[!]');
      },
      { context }
      );
    },

    joins: {
      author: () => async (post, context) => {
        post.author = await context._loaders.user.id.load(post.userId);
      },

      starers: () => async (post, context) => {
        if (!post.starIds) return;
        post.starers = await context._loaders.user.id.loadMany(post.starIds);
      },

      reputation_author: (...args) => async (post, context) => {
        if (!post.reputation) return null;
        const authors = await context._loaders.user.id.loadMany(post.reputation.map(rep => rep.userId));
        post.reputation.forEach((rep, i) => { rep.author = authors[i].name; });
      },

      comments: {
        resolver: (...args) => async (post, context) => {
          post.comments = await context._loaders.comments.postId.load(post.id);
          return post.comments;
        },
        joins: commentResolvers
      }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: { $in: [1, 2, 3, 4] } } }), params: {} };

  return fastJoin(postResolvers)(context);
}
