
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BatchLoade... Remove this comment to see the full error message
const BatchLoader = require('@feathers-plus/batch-loader');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fastJoin'.
const { fastJoin, makeCallingParams } = require('../lib/index');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'posts'.
const { posts, users, comments } = require('../tests/helpers/make-services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getResults... Remove this comment to see the full error message
const { getResultsByKey, getUniqueKeys, loaderFactory } = BatchLoader;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('service fast-join', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
      author: () => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: ($select: any) => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
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
      author: () => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: ($select: any) => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
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

  return fastJoin(postResolvers, (context: any) => query)(context);
}

async function ex3 () {
  const postResolvers = {
    joins: {
      author: () => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: ($select: any) => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
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

  return fastJoin((context: any) => postResolvers, (context: any) => query)(context);
}

async function ex4 () {
  const postResolvers = {
    joins: {
      author: () => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        post.author = (await users.find({
          query: {
            id: post.userId
          }
        }))[0];
      },
      starers: ($select: any) => async (post: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        post.starers = await users.find({
          query: {
            id: { $in: post.starIds }, $select: $select || ['name']
          }
        });
      },
      starerCount: () => (post: any) => { post.starerCount = post.starIds.length; }
    }
  };

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex5 () {
  const postResolvers = {
    joins: {
      comments: {
        resolver: ($select: any, $limit: any, $sort: any) => async (post: any) => {
          post.comments = await comments.find({
            query: {
              postId: post.id, $select: $select, $limit: $limit || 5, [$sort]: { createdAt: -1 }
            }
          });
          return post.comments;
        },
        joins: {
          author: ($select: any) => async (comment: any) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
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
      author: ($select: any) => async (comment: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
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
        resolver: ($select: any, $limit: any, $sort: any) => async (post: any) => {
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
    before: (context: any) => {
      context._loaders = { user: {} };

      context._loaders.user.id = loaderFactory(users, 'id', false)(context);
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

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

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

  const context = { method: 'find', result: await posts.find({ query: { id: 1 } }), params: {} };

  return fastJoin(postResolvers)(context);
}

async function ex9 () {
  const commentResolvers = {
    joins: {
      author: () => async (comment: any, context: any) => {
        if (!comment.userId) return;
        comment.author = await context._loaders.user.id.load(comment.userId);
      }
    }
  };

  const postResolvers = {
    before: (context: any) => {
      context._loaders = { user: {}, comments: {} };

      context._loaders.user.id = new BatchLoader(async (keys: any, context: any) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'find' does not exist on type '(this: any... Remove this comment to see the full error message
        const result = await users.find(makeCallingParams(context, { id: { $in: getUniqueKeys(keys) } }));
        return getResultsByKey(keys, result, (user: any) => user.id, '!');
      },
      { context }
      );

      context._loaders.comments.postId = new BatchLoader(async (keys: any, context: any) => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 2.
        const result = await comments.find(makeCallingParams(context, { postId: { $in: getUniqueKeys(keys) } }));
        return getResultsByKey(keys, result, (comment: any) => comment.postId, '[!]');
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

      reputation_author: (...args: any[]) => async (post: any, context: any) => {
        if (!post.reputation) return null;
        const authors = await context._loaders.user.id.loadMany(post.reputation.map((rep: any) => rep.userId));
        post.reputation.forEach((rep: any, i: any) => { rep.author = authors[i].name; });
      },

      comments: {
        resolver: (...args: any[]) => async (post: any, context: any) => {
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
