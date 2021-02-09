---
title: Guides
---

## Making Hook Params Dynamic

You will usually use static parameters for your hooks, e.g. `disallow('rest')`. However you will periodically need the parameters to vary depending on then current circumstances.

This code will **not work** as hoped, as `disallowWhat` is evaluated when the module is required, not at each service call.

```js
function disallowWhat() {
  return someVariableCircumstance() ? 'rest' : 'external'
}
// ...
module.exports = {
  before: {
    all: disallow(disallowWhat())
  }
}
```

This code will also **not do**, as most parameters do not permit functions, and `disallowWhat` will not be called for each service call.

```js
function disallowWhat() {
  return someVariableCircumstance() ? 'rest' : 'external'
}
// ...
module.exports = {
  before: {
    all: disallow(disallowWhat)
  }
}
```

You are able to call `disallowWhat` for each service call as follows.

```js
function disallowWhat() {
  return someVariableCircumstance() ? 'rest' : 'external'
}
// ...
module.exports = {
  before: {
    all: context => disallow(disallowWhat())(context)
  }
}
```

`disallowWhat` is called each time the hook is run. `disallow(disallowWhat())` creates a new hook with the value returned by `disallowWhat()`, and then that hook is invoked with `(context)`.

Let's look at another example. The `user` record identifies information the user permits to be public, in its `public` field. We can write a hook retaining only the fields allowed to be exposed.

```js
module.exports = {
  after: {
    get: context => keep(...context.params.user.public)(context)
  }
}
```

## fastJoin

We often want to combine rows from two or more tables based on a relationship between them. The `fastJoin` hook will select records that have matching values in both tables. It can batch service calls and cache records, thereby needing roughly an order of magnitude fewer database calls than the `populate` hook, i.e. _2_ calls instead of _20_. It uses a [GraphQL](http://graphql.org/)-like imperative API.

`fastJoin` is not restricted to using data from Feathers services. Resources for which there are no Feathers adapters can [also be used](/v1/batch-loader/common-patterns.html#Using-non-Feathers-services).

### Usage

```js
const postResolvers = {
  joins: {
    author: ...,
    starers: fieldNames => record => /* modify record */,
    comments: {
      resolver: ...,
      joins: {
        author: ...,
      }
    },
  }
};

const query = {
  author: true, // or falsy
  starers: ['name'], // [param1, param2, ...]
  comments: {
    args: [...], // [param1, param2, ...]
    author: true,
};

// Options for hook API
fastJoin(postResolvers)
fastJoin(postResolvers, query)
fastJoin(context => postResolvers)
fastJoin(postResolvers, context => query) // supports queries from client
```

The `fastJoin(resolvers, query)` API, like GraphQL, uses resolvers to provide a mapping between a portion of an operation and actual backend code responsible for handling it.

It also takes an optional query with which you can customise the current operation. For example, the returned information may have to differ depending on the needs of the client making the service call.

<p class="tip">The services in all these examples are assumed, for simplicity, to have pagination disabled. You will have to decode when to use `paginate: false` in your code.</p>

### Resolvers

```js
// project/src/services/posts/posts.hooks.js
const { fastJoin } = require('feathers-hooks-common')

const postResolvers = {
  joins: {
    author: (...args) => async (post, { app }) => {
      post.author = (
        await app.services('users').find({
          query: {
            id: post.userId
          }
        })
      )[0]
    },

    starers: $select => async (post, { app }) => {
      post.starers = await app.services('users').find({
        query: {
          id: { $in: post.starIds },
          $select: $select || ['name']
        }
      })
    }
  }
}

module.exports = {
  after: {
    all: [fastJoin(postResolvers)]
  }
}
```

The above example has two resolvers. Let's focus on `author`.

| Code fragment                                             | Description                                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `joins: {}`                                               | Describes what operations to perform on each record stored in the hook.                                            |
| `author:`                                                 | Every operation has a property name. You use these names in the optional query to control which resolvers are run. |
| `(...args) =>`                                            | You can pass parameters in the query to the resolvers.                                                             |
| `async post => {...}`                                     | The record to be operated on is passed to the resolver func. The resolver function modifies it.                    |
| `=> post.author =` `await users.find(` `id: post.userId)` | A field is added containing the associated `users` record.                                                         |
| `[0]`                                                     | Extract the single user record from the array returned by `users.find()`.                                          |
| `fastJoin(postResolvers)`                                 | When no query is provided, all resolvers are run with undefined params.                                            |

The result would look like:

```js
// Original record
;[{ id: 1, body: 'John post', userId: 101, starIds: [102, 103, 104] }][
  // Result
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    author: { id: 101, name: 'John' },
    starers: [{ name: 'Marshall' }, { name: 'Barbara' }, { name: 'Aubree' }]
  }
]
```

### Shaping the Result

```js
const query = {
  author: true
}

module.exports = {
  after: {
    all: [fastJoin(postResolvers, query)]
  }
}
```

The above query requests the author resolver be run, but not the starers resolver. This is a GraphQL concept which _shapes_ the result. The result will not contain the `starers` field which the starers resolver would have otherwise added.

> All resolvers are run if query is not provided.

```js
// Result
;[
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    author: { id: 101, name: 'John' }
  }
]
```

### Customize Resolver Operation

```js
const query = {
  author: true,
  starers: [['id', 'name']]
};

const postResolvers = {
  joins: {
    author: ...,

    starers: $select => async post => { post.starers = await users.find({
      query: { id: { $in: post.starIds }, $select: $select || ['name'] },
      paginate: false
    }) },
  }
};

module.exports = { after: {
    all: [ fastJoin(postResolvers, context => query) ],
} };
```

Parameters may be passed to the resolver functions. The `starers` field will contain both the `id` and `name` from the user record, rather than the default of only `name`.

The `context => query` syntax shows the query can be dynamically modified based on information provided by the client.

The `paginate:false` suppress pagination for this call, ensuring all the matching records are returned.

> Being able to create dynamic queries is an important concept to remember.

```js
// Result
;[
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    author: { id: 101, name: 'John' },
    starers: [
      { id: 102, name: 'Marshall' },
      { id: 103, name: 'Barbara' },
      { id: 104, name: 'Aubree' }
    ]
  }
]
```

### Calculated Fields

```js
const postResolvers = {
  joins: {
    ...,
    starerCount: () => post => { post.starerCount = post.starIds.length },
  }
};
```

A resolver function can make any sort of modification to the passed record; it is not limited to making service calls. Resolvers can use resources for which there is [no Feathers adapter](/v1/batch-loader/common-patterns.html#Using-non-Feathers-services).

Here, the starerCount resolver adds the field `starerCount` containing a count of the `starIds`.

```js
// Result
;[
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    starerCount: 3,
    author: { id: 101, name: 'John' },
    starers: [{ name: 'Marshall' }, { name: 'Barbara' }, { name: 'Aubree' }]
  }
]
```

### Recursive Operations

We have been operating on the passed record by adding data to it. We can also recursively operate of that added data. We have been using a convenience syntax for resolvers so far:

```js
// Convenience syntax
starers: () => record => ...
// Equivalent to
starers: {
  resolver: () => record ==> ...
}
```

The syntax for recursive operations uses the syntax below, where the `joins` will operate on the data returned by the comments resolver in the same fashion the top-level `joins` operated on the original record.

```js
comments: {
  resolver: () => records => ...,
  joins: { ... }
}
```

The comments resolver below adds related comment records to the passed record. The resolver function returns those comments, and that is the data which we will recursively operate on.

> The resolver function must return the data that is to be recursively operated on. Forgetting to do this is a common mistake.

```js
const postResolvers = {
  joins: {
    comments: {
      resolver: ($select, $limit, $sort) => async post => {
        post.comments = await comments.find({
          query: { postId: post.id, $select: $select, $limit: $limit || 5, [$sort]: { createdAt: -1 } },
          paginate: false
        });
        return post.comments;
      },

      joins: {
        author: $select => async comment => { comment.author = (await users.find({
          query: { id: comment.userId, $select: $select },
          paginate: false
        }))[0] },
      },
    },
  }
};

const query = {
  comments: {
    args: [...],
    author: [['id', 'name']]
  },
};
```

```js
// Original record
;[{ id: 1, body: 'John post', userId: 101, starIds: [102, 103, 104] }][
  // Result
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    comments: [
      {
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
      }
    ]
  }
]
```

### Keeping Resolvers DRY

The comments records contain a `userId` field which we use to associate the user record. Comment records themselves may be associated with posts records, with other comment records, etc.

We don't want to have to include the resolver for the user record every time we include the comment record someplace. We can keep our resolvers [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) by defining resolvers for each base table separately and then referring to those resolvers when we need them.

```js
const commentResolvers = {
  joins: {
    author: $select => async comment => {
      comment.author = (
        await users.find({
          query: { id: comment.userId, $select: $select || ['name'] },
          paginate: false
        })
      )[0]
    }
  }
}

const postResolvers = {
  joins: {
    comments: {
      resolver: ($select, $limit, $sort) => async post => {
        post.comments = await comments.find({
          query: {
            postId: post.id,
            $select: $select,
            $limit: $limit || 5,
            [$sort]: { createdAt: -1 }
          },
          paginate: false
        })
        return post.comments
      },

      joins: commentResolvers
    }
  }
}
```

The comments resolver no longer has its own resolvers defined inline within its `joins:`. A reference is made to the comments resolver definition.

### Batch-loaders

We have been looking till now into the structure and flexibility of `fastJoin`. What we have done at so far makes as many database calls as the `populate` hook.

We will use batch-loaders to dramatically reduce the number of database calls needed. Its not uncommon for operations that would have required _20_ database calls to make only _2_ using batch-loaders.

You need to understand batch-loaders before we proceed, so [read about them now.](../batch-loader/guide.html)

### Using a Simple Batch-Loader

```js
const { fastJoin } = require('feathers-hooks-common')
const BatchLoader = require('@feathers-plus/batch-loader')
const { loaderFactory } = BatchLoader

const postResolvers = {
  before: context => {
    context._loaders = { user: {} }
    context._loaders.user.id = loaderFactory(users, 'id', false, {
      paginate: false
    })(context)
  },

  joins: {
    author: () => async (post, context) =>
      (post.author = await context._loaders.user.id.load(post.userId)),

    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starers = await context._loaders.user.id.loadMany(post.starIds))
  }
}
```

Let's look at the code in this example:

| Code fragment                                              | Description                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `before:`                                                  | This function is executed before the operations start. Only the top-most `before` is run; any in recursive `joins` are ignored.                                                                                                                                                                                                                                           |
| `context._loaders`                                         | An empty object is initialized by `fastJoin`. This is implemented as a stack, any value existing before `fastJoin` starts is stashed, and later restored as the hook terminates.                                                                                                                                                                                          |
| `context._loaders.user.id`                                 | You can avoid confusion by organizing batch-loaders unambiguously. In this example `user` indicates the batch-loader returns single `user` records; the `id` indicates its keys will match `user.id`.                                                                                                                                                                     |
| `loaderFactory(users,` `'id', false, { paginate: false })` | A convenience method for building straight forward batch-loaders. The batch loader reads record from the `users` service. The keys passed to it are `id` fields which it will match to `user.id`. The `false` indicates the batch loader returns single records for each key rather than an array of records. `params.pagination`is set to `false` to disable pagination. |
| `context._loaders` `.user.id.load()`                       | Obtains data from the batch-loader for one key. Externally it acts like `await users.find(...)`.                                                                                                                                                                                                                                                                          |
| `context._loaders` `.user.id.loadMany()`                   | This is how you obtain records for multiple keys from the data-loader.                                                                                                                                                                                                                                                                                                    |
| `!post.starIds ? null : ...`                               | Handle `posts.starIds` which may not exist.                                                                                                                                                                                                                                                                                                                               |

```js
// Original record
;[{ id: 1, body: 'John post', userId: 101, starIds: [102, 103, 104] }][
  // Result
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    author: { id: 101, name: 'John' },
    starers: [
      { id: 102, name: 'Marshall' },
      { id: 103, name: 'Barbara' },
      { id: 104, name: 'Aubree' }
    ]
  }
]
```

> The batch-loader made just _2_ database calls. `populate` would have made _8_.

### Using Batch-Loaders

The `loaderFactory(users, 'id', false)` above is just a convenience wrapper for building a BatchLoader. We can create our batch loaders directly should we need them to do more.

```js
const { fastJoin, makeCallingParams } = require('feathers-hooks-common')
const BatchLoader = require('@feathers-plus/batch-loader')
const { getResultsByKey, getUniqueKeys } = BatchLoader

const postResolvers = {
  before: context => {
    context._loaders = { user: {} }

    context._loaders.user.id = new BatchLoader(
      async (keys, context) => {
        const result = await users.find(
          makeCallingParams(
            context,
            { id: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false }
          )
        )
        return getResultsByKey(keys, result, user => user.id, '!')
      },
      { context }
    )
  },

  joins: {
    author: () => async (post, context) =>
      (post.author = await context._loaders.user.id.load(post.userId)),

    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starers = await context._loaders.user.id.loadMany(post.starIds))
  }
}
```

> The [batch-loader guide](../batch-loader) explains how to create batch-loaders.

### Putting It All Together

Let's finish by putting together all we've seen in a comprehensive example.

Let's also add a `reputation` array of objects to `posts`. This will show the increased flexibility of `fastJoin`, as `populate` cannot handle such a structure directly.

```js
// project/src/services/posts/posts.hooks.js
const { fastJoin, makeCallingParams } = require('feathers-hooks-common')
const BatchLoader = require('@feathers-plus/batch-loader')
const { getResultsByKey, getUniqueKeys } = BatchLoader

const commentResolvers = {
  joins: {
    author: () => async (comment, context) =>
      !comment.userId
        ? null
        : (comment.userRecord = await context._loaders.user.id.load(
            comment.userId
          ))
  }
}

const postResolvers = {
  before: context => {
    context._loaders = { user: {}, comments: {} }

    context._loaders.user.id = new BatchLoader(
      async (keys, context) => {
        const result = await users.find(
          makeCallingParams(
            context,
            { id: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false }
          )
        )
        return getResultsByKey(keys, result, user => user.id, '!')
      },
      { context }
    )

    context._loaders.comments.postId = new BatchLoader(
      async (keys, context) => {
        const result = await comments.find(
          makeCallingParams(
            context,
            { postId: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false }
          )
        )
        return getResultsByKey(keys, result, comment => comment.postId, '[!]')
      },
      { context }
    )
  },

  joins: {
    author: () => async (post, context) =>
      (post.userRecord = await context._loaders.user.id.load(post.userId)),

    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starIdsRecords = await context._loaders.user.id.loadMany(
            post.starIds
          )),

    reputation_author: () => async (post, context) => {
      if (!post.reputation) return null
      const authors = await context._loaders.user.id.loadMany(
        post.reputation.map(rep => rep.userId)
      )
      post.reputation.forEach((rep, i) => {
        rep.author = authors[i].name
      })
    },

    comments: {
      resolver: (...args) => async (post, context) =>
        (post.commentRecords = await context._loaders.comments.postId.load(
          post.id
        )),
      joins: commentResolvers
    }
  }
}

const query = {
  author: true,
  starers: [['id', 'name']],
  comments: {
    args: null,
    author: [['id', 'name']]
  }
}

module.exports = {
  after: {
    all: [fastJoin(postResolvers, context => query)]
  }
}
```

We are using 2 batch-loaders, one for single user records, the other for arrays of comment records.

```js
// Original records
[ { id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    reputation: [ // The `populate` hook cannot handle this structure.
      { userId: 102, points: 1 },
      { userId: 103, points: 1 },
      { userId: 104, points: 1 }
    ]},
  { id: 2, body: 'Marshall post', userId: 102, starIds: [101, 103, 104] },
  { id: 3, body: 'Barbara post', userId: 103 },
  { id: 4, body: 'Aubree post', userId: 104 }
]

// Results
[ { id: 1,
    body: 'John post',
    userId: 101,
    starIds: [ 102, 103, 104 ],
    reputation:
     [ { userId: 102, points: 1, author: 'Marshall' },
       { userId: 103, points: 1, author: 'Barbara' },
       { userId: 104, points: 1, author: 'Aubree' } ],
    author: { id: 101, name: 'John' },
    comments:
     [ { id: 11,
         text: 'John post Marshall comment 11',
         postId: 1,
         userId: 102,
         author: { id: 102, name: 'Marshall' } },
       { id: 12,
         text: 'John post Marshall comment 12',
         postId: 1,
         userId: 102,
         author: { id: 102, name: 'Marshall' } },
       { id: 13,
         text: 'John post Marshall comment 13',
         postId: 1,
         userId: 102,
         author: { id: 102, name: 'Marshall' } } ],
    starers:
     [ { id: 102, name: 'Marshall' },
       { id: 103, name: 'Barbara' },
       { id: 104, name: 'Aubree' } ] },
  { id: 2,
    body: 'Marshall post',
    userId: 102,
    starIds: [ 101, 103, 104 ],
    author: { id: 102, name: 'Marshall' },
    comments:
     [ { id: 14,
         text: 'Marshall post John comment 14',
         postId: 2,
         userId: 101,
         author: { id: 101, name: 'John' } },
       { id: 15,
         text: 'Marshall post John comment 15',
         postId: 2,
         userId: 101,
         author: { id: 101, name: 'John' } } ],
    starers:
     [ { id: 101, name: 'John' },
       { id: 103, name: 'Barbara' },
       { id: 104, name: 'Aubree' } ] },
  { id: 3,
    body: 'Barbara post',
    userId: 103,
    author: { id: 103, name: 'Barbara' },
    comments:
     [ { id: 16,
         text: 'Barbara post John comment 16',
         postId: 3,
         userId: 101,
         author: { id: 101, name: 'John' } } ] },
  { id: 4,
    body: 'Aubree post',
    userId: 104,
    author: { id: 104, name: 'Aubree' },
    comments:
     [ { id: 17,
         text: 'Aubree post Marshall comment 17',
         postId: 4,
         userId: 102,
         author: { id: 102, name: 'Marshall' } } ] },
]
```

Each batch-loader made just one database call:

- `users.find({ query: { id: { $in: [ 101, 102, 103, 104] } } })`
- `comments.find({ query: { postId: { $in: [ 1, 2, 3, 4 ] } } })`

> Only _2_ database calls were needed to construct the result above. `populate` requires _22_ calls.

### Using a Persistent Cache

Our BatchLoaders have been batching service calls together and keeping those results in a cache. This way those records don't have to be read again.

However each BatchLoader has been starting each request with an empty cache. So if 2 sequential `fastJoin` hook calls each need user id 101, they both need to **prime** their cache by each reading that record.

We can improve the situation by using persistent caches with the BatchLoaders. A persistent cache stores records so future requests for those records can be served faster; the records stored in the cache are duplicates of records stored in the database.

Let's see how we can use the [cache hook](./index.html#cache) as it maintains a persistent cache for the service its registered on.

```js
const { cache, fastJoin, makeCallingParams } = require('feathers-hooks-common')
const BatchLoader = require('@feathers-plus/batch-loader')
const CacheMap = require('@feathers-plus/cache')
const { getResultsByKey, getUniqueKeys } = BatchLoader

// Create a cache for a maximum of 100 users
const cacheMapUsers = CacheMap({ max: 100 })

// Create a batchLoader using the persistent cache
const userBatchLoader = new BatchLoader(
  async keys => {
    const result = await users.find(
      makeCallingParams({}, { id: { $in: getUniqueKeys(keys) } }, undefined, {
        paginate: false
      })
    )
    return getResultsByKey(keys, result, user => user.id, '!')
  },
  { cacheMap: cacheMapUsers }
)

const postResolvers = {
  before: context => {
    context._loaders = { user: {} }
    context._loaders.user.id = userBatchLoader
  },

  joins: {
    author: () => async (post, context) =>
      (post.author = await context._loaders.user.id.load(post.userId)),

    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starers = await context._loaders.user.id.loadMany(post.starIds))
  }
}

const query = {
  author: true,
  starers: [['id', 'name']],
  comments: {
    args: null,
    author: [['id', 'name']]
  }
}

module.exports = {
  before: {
    all: cache(cacheMapUsers)
  },
  after: {
    all: [cache(cacheMapUsers), fastJoin(postResolvers, () => query)]
  }
}
```

> The `cache` hook **must** be registered in both `before` and `after`.

The number of service calls needed to run the `query` above **the second time**:

|                  Using | number of service calls |
| ---------------------: | :---------------------: |
|             `populate` |         **22**          |
|       `fastJoin` alone |          **2**          |
| `fastJoin` and `cache` |          **0**          |

The `cache` hook also makes `get` service calls more efficient.

### The GraphQL Feathers Adapter

By now you have an understanding of the foundations of Facebook's [GraphQL](http://graphql.org/). GraphQL however is more powerful and flexible.

You may want to read about the Feathers service adapter [@feathers-plus/graphql](../graphql). **It supports SQL and non-SQL databases,** and automatically generates the resolver functions.

<!--=============================================================================================-->
<!--=============================================================================================-->
<!--=============================================================================================-->

## Populate

### `populate(options: Object): HookFunc` [source](https://github.com/feathersjs/feathers-hooks-common/blob/master/src/services/populate.js)

Populates items _recursively_ to any depth. Supports 1:1, 1:n and n:1 relationships.

- Used as a **before** or **after** hook on any service method.
- Supports multiple result items, including paginated `find`.
- Permissions control what a user may see.
- Provides performance profile information.
- Backward compatible with the old FeathersJS `populate` hook.

### Examples

- 1:1 relationship

```javascript
// users like { _id: '111', name: 'John', roleId: '555' }
// roles like { _id: '555', permissions: ['foo', bar'] }
import { populate } from 'feathers-hooks-common'

const userRoleSchema = {
  include: {
    service: 'roles',
    nameAs: 'role',
    parentField: 'roleId',
    childField: '_id'
  }
}

app.service('users').hooks({
  after: {
    all: populate({ schema: userRoleSchema })
  }
})

// result like
// { _id: '111', name: 'John', roleId: '555',
//   role: { _id: '555', permissions: ['foo', bar'] } }
```

- 1:n relationship

```javascript
// users like { _id: '111', name: 'John', roleIds: ['555', '666'] }
// roles like { _id: '555', permissions: ['foo', 'bar'] }
const userRolesSchema = {
  include: {
    service: 'roles',
    nameAs: 'roles',
    parentField: 'roleIds',
    childField: '_id'
  }
}

usersService.hooks({
  after: {
    all: populate({ schema: userRolesSchema })
  }
})

// result like
// { _id: '111', name: 'John', roleIds: ['555', '666'], roles: [
//   { _id: '555', permissions: ['foo', 'bar'] }
//   { _id: '666', permissions: ['fiz', 'buz'] }
// ]}
```

- n:1 relationship

```javascript
// posts like { _id: '111', body: '...' }
// comments like { _id: '555', text: '...', postId: '111' }
const postCommentsSchema = {
  include: {
    service: 'comments',
    nameAs: 'comments',
    parentField: '_id',
    childField: 'postId'
  }
}

postService.hooks({
  after: {
    all: populate({ schema: postCommentsSchema })
  }
})

// result like
// { _id: '111', body: '...' }, comments: [
//   { _id: '555', text: '...', postId: '111' }
//   { _id: '666', text: '...', postId: '111' }
// ]}
```

- Multiple and recursive includes

```javascript
const schema = {
  service: '...',
  permissions: '...',
  include: [
    {
      service: 'users',
      nameAs: 'authorItem',
      parentField: 'author',
      childField: 'id',
      include: [ ... ],
    },
    {
      service: 'comments',
      parentField: 'id',
      childField: 'postId',
      query: {
        $limit: 5,
        $select: ['title', 'content', 'postId'],
        $sort: {createdAt: -1}
      },
      select: (hook, parent, depth) => ({ $limit: 6 }),
      asArray: true,
      provider: undefined,
    },
    {
      service: 'users',
      permissions: '...',
      nameAs: 'readers',
      parentField: 'readers',
      childField: 'id'
    }
  ],
};

module.exports.after = {
  all: populate({ schema, checkPermissions, profile: true })
};
```

- Flexible relationship, similar to the n:1 relationship example above

```javascript
// posts like { _id: '111', body: '...' }
// comments like { _id: '555', text: '...', postId: '111' }
const postCommentsSchema = {
  include: {
    service: 'comments',
    nameAs: 'comments',
    select: (hook, parentItem) => ({ postId: parentItem._id })
  }
}

postService.hooks({
  after: {
    all: populate({ schema: postCommentsSchema })
  }
})

// result like
// { _id: '111', body: '...' }, comments: [
//   { _id: '555', text: '...', postId: '111' }
//   { _id: '666', text: '...', postId: '111' }
// ]}
```

### Options

- `schema` (_required_, object or function) How to populate the items. [Details are below.](#schema)
  - Function signature `(hook: Hook, options: Object): Object`
  - `hook` The hook.
  - `options` The `options` passed to the populate hook.
- `checkPermissions` [optional, default () => true] Function to check if the user is allowed to perform this populate,
  or include this type of item. Called whenever a `permissions` property is found. - Function signature `(hook: Hook, service: string, permissions: any, depth: number): boolean` - `hook` The hook. - `service` The name of the service being included, e.g. users, messages. - `permissions` The value of the permissions property. - `depth` How deep the include is in the schema. Top of schema is 0. - Return truesy to allow the include.
- `profile` [optional, default false] If `true`, the populated result is to contain a performance profile.
  Must be `true`, truesy is insufficient.

### Schema

The data currently in the hook will be populated according to the schema. The schema starts with:

```javascript
const schema = {
  service: '...',
  permissions: '...',
  include: [ ... ]
};
```

- `service` (_optional_) The name of the service this schema is to be used with.
  This can be used to prevent a schema designed to populate 'blog' items
  from being incorrectly used with `comment` items.
- `permissions` (_optional_, any type of value) Who is allowed to perform this populate. See `checkPermissions` above.
- `include` (_optional_) Which services to join to the data.

#### Include

The `include` array has an element for each service to join. They each may have:

```javascript
{ service: 'comments',
  nameAs: 'commentItems',
  permissions: '...',
  parentField: 'id',
  childField: 'postId',
  query: {
    $limit: 5,
    $select: ['title', 'content', 'postId'],
    $sort: {createdAt: -1}
  },
  select: (hook, parent, depth) => ({ $limit: 6 }),
  asArray: true,
  paginate: false,
  provider: undefined,
  useInnerPopulate: false,
  include: [ ... ]
}
```

> **ProTip** Instead of setting `include` to a 1-element array,
> you can set it to the include object itself,
> e.g. `include: { service: ..., nameAs: ..., ... }`.

- `service` [required, string] The name of the service providing the items.
- `nameAs` [optional, string, default is service] Where to place the items from the join.
  Dot notation is allowed.
- `permissions` [optional, any type of value] Who is allowed to perform this join. See `checkPermissions` above.
- `parentField` [required if neither query nor select, string] The name of the field in the parent item for the [relation](#relation).
  Dot notation is allowed.
- `childField` [required if neither query nor select, string] The name of the field in the child item for the [relation](#relation).
  Dot notation is allowed and will result in a query like `{ 'name.first': 'John' }`
  which is not suitable for all DBs.
  You may use `query` or `select` to create a query suitable for your DB.
- `query` [optional, object] An object to inject into the query in `service.find({ query: { ... } })`.
- `select` [optional, function] A function whose result is injected into the query.
  - Function signature `(hook: Hook, parentItem: Object, depth: number): Object`
  - `hook` The hook.
  - `parentItem` The parent item to which we are joining.
  - `depth` How deep the include is in the schema. Top of schema is 0.
- `asArray` [optional, boolean, default false] Force a single joined item to be stored as an array.
- `paginate` {optional, boolean or number, default false]
  Controls pagination for this service. - `false` No pagination. The default. - `true` Use the configuration provided when the service was configured/ - A number. The maximum number of items to include.
- `provider` [optional] `find` calls are made to obtain the items to be joined.
  These, by default, are initialized to look like they were made
  by the same provider as that getting the base record.
  So when populating the result of a call made via `socketio`,
  all the join calls will look like they were made via `socketio`.
  Alternative you can set `provider: undefined` and the calls for that join will
  look like they were made by the server.
  The hooks on the service may behave differently in different situations.
- `useInnerPopulate` [optional] Populate, when including records from a child service,
  ignores any populate hooks defined for that child service.
  The useInnerPopulate option will run those populate hooks.
  This allows the populate for a base record to include child records
  containing their own immediate child records,
  without the populate for the base record knowing what those grandchildren populates are.
- `include` [optional] The new items may themselves include other items. The includes are recursive.

Populate forms the query `[childField]: parentItem[parentField]` when the parent value is not an array.
This will include all child items having that value.

Populate forms the query `[childField]: { $in: parentItem[parentField] }` when the parent value is an array.
This will include all child items having any of those values.

A populate hook for, say, `posts` may include items from `users`.
Should the `users` hooks also include a populate,
that `users` populate hook will not be run for includes arising from `posts`.

> **ProTip** The populate interface only allows you to directly manipulate `hook.params.query`.
> You can manipulate the rest of `hook.params` by using the
> [`client`](https://docs.feathersjs.com/v/auk/hooks/common/utils.html#client) hook,
> along with something like `query: { ..., $client: { paramsProp1: ..., paramsProp2: ... } }`.

### Added properties

Some additional properties are added to populated items. The result may look like:

```javascript
{ ...
  _include: [ 'post' ],
  _elapsed: { post: 487947, total: 527118 },
  post:
    { ...
      _include: [ 'authorItem', 'commentsInfo', 'readersInfo' ],
      _elapsed: { authorItem: 321973, commentsInfo: 469375, readersInfo: 479874, total: 487947 },
      _computed: [ 'averageStars', 'views' ],
      authorItem: { ... },
      commentsInfo: [ { ... }, { ... } ],
      readersInfo: [ { ... }, { ... } ]
} }
```

- `_include` The property names containing joined items.
- `_elapsed` The elapsed time in nano-seconds (where 1,000,000 ns === 1 ms) taken to perform each include,
  as well as the total taken for them all.
  This delay is mostly attributed to your DB.
- `_computed` The property names containing values computed by the `serialize` hook.

The [depopulate](#depopulate) hook uses these fields to remove all joined and computed values.
This allows you to then `service.patch()` the item in the hook.

### Joining without using related fields

Populate can join child records to a parent record using the related columns
`parentField` and `childField`.
However populate's `query` and `select` options may be used to related the
records without needing to use the related columns.
This is a more flexible, non-SQL-like way of relating records.
It easily supports dynamic, run-time schemas since the `select` option may be
a function.

### Populate examples

#### Selecting schema based on UI needs

Consider a Purchase Order item.
An Accounting oriented UI will likely want to populate the PO with Invoice items.
A Receiving oriented UI will likely want to populate with Receiving Slips.

Using a function for `schema` allows you to select an appropriate schema based on the need.
The following example shows how the client can ask for the type of schema it needs.

```javascript
// on client
import { paramsForServer } from 'feathers-hooks-common'
purchaseOrders.get(id, paramsForServer({ schema: 'po-acct' })) // pass schema name to server
// or
purchaseOrders.get(id, paramsForServer({ schema: 'po-rec' }))
```

```javascript
// on server
import { paramsFromClient } from 'feathers-hooks-common';
const poSchemas = {
  'po-acct': /* populate schema for Accounting oriented PO e.g. { include: ... } */,
  'po-rec': /* populate schema for Receiving oriented PO */
};

purchaseOrders.before({
  all: paramsfromClient('schema')
});

purchaseOrders.after({
  all: populate({ schema: hook => poSchemas[hook.params.schema] }),
});
```

#### Using permissions

For a simplistic example,
assume `hook.params.users.permissions` is an array of the service names the user may use,
e.g. `['invoices', 'billings']`.
These can be used to control which types of items the user can see.

The following populate will only be performed for users whose `user.permissions` contains `'invoices'`.

```javascript
const schema = {
  include: [
    {
      service: 'invoices',
      permissions: 'invoices',
      ...
    }
  ]
};

purchaseOrders.after({
  all: populate(schema, (hook, service, permissions) => hook.params.user.permissions.includes(service))
});
```

## Validate

### Example

Comprehensive validation may include the following:

- Object schema validation. Checking the item object contains the expected properties with values in the expected format. The values might get sanitized. Knowing the item is well formed makes further validation simpler.
- Re-running any validation supposedly already done on the front-end. It would be an asset if the server can re-run the same code the front-end used.
- Performing any validation and sanitization unique to the server.

A full featured example of such a process appears below. It validates and sanitizes a new user before adding the user to the database.

- The form expects to be notified of errors in the format `{ email: 'Invalid email.', password: 'Password must be at least 8 characters.' }`.
- The form calls the server for async checking of selected fields when control leaves those fields. This for example could check that an email address is not already used by another user.
- The form does local sync validation when the form is submitted.
- The code performing the validations on the front-end is also used by the server.
- The server performs schema validation using Walmart's [Joi](https://github.com/hapijs/joi).
- The server does further validation and sanitization.

### Validation using Validate

```javascript
// file /server/services/users/users.hooks.js
const auth = require('feathers-authentication').hooks
const { callbackToPromise, remove, validate } = require('feathers-hooks-common')
const validateSchema = require('feathers-hooks-validate-joi')

const clientValidations = require('/common/usersClientValidations')
const serverValidations = require('/server/validations/usersServerValidations')
const schemas = require('/server/validations/schemas')

const serverValidationsSignup = callbackToPromise(serverValidations.signup, 1)

exports.before = {
  create: [
    validateSchema.form(schemas.signup, schemas.options), // schema validation
    validate(clientValidations.signup), // re-run form sync validation
    validate(values => clientValidations.signupAsync(values, 'someMoreParams')), // re-run form async
    validate(serverValidationsSignup), // run server validation
    remove('confirmPassword'),
    auth.hashPassword()
  ]
}
```

### Validation routines for front and back-end.

Validations used on front-end. They are re-run by the server.

```javascript
// file /common/usersClientValidations
// Validations for front-end. Also re-run on server.
const clientValidations = {}

// sync validation of signup form on form submit
clientValidations.signup = values => {
  const errors = {}

  checkName(values.name, errors)
  checkUsername(values.username, errors)
  checkEmail(values.email, errors)
  checkPassword(values.password, errors)
  checkConfirmPassword(values.password, values.confirmPassword, errors)

  return errors
}

// async validation on exit from some fields on form
clientValidations.signupAsync = values =>
  new Promise((resolve, reject) => {
    const errs = {}

    // set a dummy error
    errs.email = 'Already taken.'

    if (!Object.keys(errs).length) {
      resolve(null) // 'null' as we did not sanitize 'values'
    }
    reject(new errors.BadRequest('Values already taken.', { errors: errs }))
  })

module.exports = clientValidations

function checkName(name, errors, fieldName = 'name') {
  if (!/^[\\sa-zA-Z]{8,30}$/.test((name || '').trim())) {
    errors[fieldName] = 'Name must be 8 or more letters or spaces.'
  }
}
```

Schema definitions used by the server.

```javascript
// file /server/validations/schemas
const Joi = require('joi')

const username = Joi.string()
  .trim()
  .alphanum()
  .min(5)
  .max(30)
  .required()
const password = Joi.string()
  .trim()
  .regex(/^[\sa-zA-Z0-9]+$/, 'letters, numbers, spaces')
  .min(8)
  .max(30)
  .required()
const email = Joi.string()
  .trim()
  .email()
  .required()

module.exports = {
  options: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
  },
  signup: Joi.object().keys({
    name: Joi.string()
      .trim()
      .min(8)
      .max(30)
      .required(),
    username,
    password,
    confirmPassword: password.label('Confirm password'),
    email
  })
}
```

Validations run by the server.

```javascript
// file /server/validations/usersServerValidations
// Validations on server. A callback function is used to show how the hook handles it.
module.exports = {
  signup: (data, cb) => {
    const formErrors = {}
    const sanitized = {}

    Object.keys(data).forEach(key => {
      sanitized[key] = (data[key] || '').trim()
    })

    cb(Object.keys(formErrors).length > 0 ? formErrors : null, sanitized)
  }
}
```

.
