---
title: cache
description: Persistent, least-recently-used record cache for services.
category: hooks
hook:
  type: ['before', 'after']
  method: ['find', 'get', 'create', 'update', 'patch', 'remove']
  multi: true
---

## Arguments

- `{Object | Map} cacheMap`
- `{String} [ keyField ]`
- `{Object} [ options ]`
  - `{Function} [ clone ]`
  - `{Function} [makeCacheKey]`

| Argument   |      Type      | Default                                            | Description                                                                  |
| ---------- | :------------: | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `cacheMap` | `Object` `Map` |                                                    | Instance of `Map`, or an object with a similar API, to be used as the cache. |
| `keyField` |    `String`    | `context.service.id` or `item._id ? '_id' !! 'id'` | The name of the record id field.                                             |
| `option`   |    `Object`    |                                                    | Options.                                                                     |

| `options`      | Argument   |                      Type                      | Default                                                                                                                                          | Description |
| -------------- | ---------- | :--------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `clone`        | `Function` | `item => JSON.parse(` `JSON.stringify(item) )` | Function to perform a deep clone. See below.                                                                                                     |
| `makeCacheKey` | `Function` |                  `key => key`                  | Function to convert record key to cache key. Use this to convert MongoDB/Mongoose ObjectId/bson keys to a cache key using `item._id.toString()`. |

## Examples

```ts twoslash
const CacheMap = require('@feathers-plus/cache');
const { cache } = require('feathers-hooks-common/index.js');

const cacheMap = CacheMap({ max: 100 }); // Keep the 100 most recently used.

module.exports = { before: { all: cache(cacheMap) }, after: { all: cache(cacheMap) } };
```

```js
const { cache } = require('feathers-hooks-common/index.js');

const cacheMap = new Map();

module.exports = { before: { all: cache(cacheMap) }, after: { all: cache(cacheMap) } };
```

```js
const CacheMap = require('@feathers-plus/cache');
const mongoose = require('mongoose');
const { cache } = require('feathers-hooks-common/index.js');

const cacheMap = CacheMap({ max: 100 });
const makeCacheKey = key => (key instanceof mongoose.Types.ObjectId ? key.toString() : key);

module.exports = {
  before: { all: cache(cacheMap, undefined, { makeCacheKey }) },
  after: { all: cache(cacheMap, undefined, { makeCacheKey }) },
};
```

> The `cache` hook **must** be registered in both `before` and `after`.

  <p class="tip">The cache will grow without limit when `Map` is used and the resulting memory pressure may adversely affect your performance. `Map` should only be used when you know or can control its size.</p>

## Details

The `cache` hook maintain a persistent cache for the service it is registerd on. A persistent cache stores records so future requests for those records can be served faster; the records stored in the cache are duplicates of records stored in the database.

The `get` service method retrieves records from the cache and updates `context.result` `[.data]`. The other methods remove their `context.data` entries from the cache in the `before` hook, and add entries in the `after` hook. All the records returned by a `find` call are added to the cache.

The `cache` hook may be provided a custom Map instance to use as its memoization cache. Any object that implements the methods get(), set(), delete() and clear() can be provided. This allows for custom Maps which implement various [cache algorithms](https://en.wikipedia.org/wiki/Cache_replacement_policies) to be provided.

The companion `@feathers-plus/cache` provides a least recently-used cache which discards the least recently used items first. It is compatible with `cache` as well as the BatchLoaders used with the `fastJoin` hook.

> The `cache` hook can make [fastJoin](#fastjoin) hooks run more efficiently.

MongoDB and Mongoose store record keys as bson objects rather than as scalars. The safest way to use the cache is in conjunction with the `makeCacheKey` option.

- **options.clone**

  The clone function has a single parameter.

  - `{Object} item`

  It returns

  - `{Object} clonedItem`

| Argument     |   Type   | Default | Description        |
| ------------ | :------: | ------- | ------------------ |
| `item`       | `Object` |         | The record.        |
| `clonedItem` | `Object` |         | A clone of `item`. |
