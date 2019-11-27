---
title: Getting Started
---

# Getting Started

## Usage

Use feathers-hooks-common v4.x.x with FeathersJS Buzzard.

Use feathers-hooks-common v3.10.0 with FeathersJS Auk. v4.x.x. should also work if you don't use callbacks in your hooks.</p>

> Hooks may be used on the client as well as the server.

```js
npm install --save feathers-hooks-common

// project/src/services/posts/posts.hooks.js
const { disableMultiItemChange, fastJoin } = require('feathers-hooks-common');

const postResolvers = {
  joins: {
    author: () => async post => post.author = (await users.find({ query: {
      id: post.userId
    } }))[0],

    starers: $select => async post => post.starers = await users.find({ query: {
      id: { $in: post.starIds }, $select: $select || ['name']
    } }),
  }
};

module.exports = {
  before: {
    patch: [ disableMultiItemChange() ],
    remove: [ disableMultiItemChange() ]
  },

  after: {
    all: [ fastJoin(postResolvers) ],
  },
};
```

## Find Hooks using Tags

Each Feathers hook and utility function is listed under all the tags relevant to it.

{% hooksByTags %}

## F.A.Q.

<!--=============================================================================================-->
<h3 id="coerce">Coerce data types</h3>

A common need is converting fields coming in from query params. These fields are provided as string values by default and you may need them as numbers, booleans, etc.

The [`validateSchema`](#validateSchema) does a wide selection of [type coercions](https://github.com/epoberezkin/ajv/blob/master/COERCION.md), as well as checking for missing and unexpected fields.

<!--=============================================================================================-->

## New Features in Buzzard

> Features added since the initial Buzzard release are listed in the [What's New section](#whats-new).

These features are new in the Buzzard version.

- The docs [have been rewritten.](https://feathers-plus.github.io/v1/feathers-hooks-common)

- You can now find hooks using [tags.](#Find-Hooks-using-Tags) Each Feathers hook and utility function is listed under all the tags relevant to it.

- The new `fastJoin` hook is a much faster, more flexible alternative to `populate`.

  - It makes only about 10% of the service calls, i.e. it makes _2_ calls when `populate` would make _20_.
  - It operates on record formats which `populate` can't process.
  - It provides any Feathers service with GraphQL-light capabilities. (The new `@feathers-plus/graphql` service adapter provides similar performance with full GraphQL compatibility.)

- The new `runHook` utility may help simplify your registered hooks. It let's you call a hook with `service.get(...).then(runHook()(populate(...)));`.

- Other new hooks and utility functions.

  - `alterItems` - Flexibly mutate data and results. Powerful.
  - `cache` - Persistent, least-recently-used record cache for services.
  - `disablePagination` - Disables pagination when `query.$limit` is -1 or '-1'.
  - `discardQuery`, `keep`, `keepQuery` - See Migration below.
  - `makeCallingParams` utility - Help construct `context.params` when calling services within hooks.
  - `required` - Check selected fields exist and are not falsey. Numeric 0 is acceptable.
  - `runParallel` - Run a hook in parallel to the other hooks and the service call.

- Enhancements to existing hooks.

  - `debug` now displays `context.params` property names and displays the values of selected ones.
  - `preventChanges` can now optionally remove unacceptable changes instead of throwing.

<!--=============================================================================================-->

## Migrating from Auk to Buzzard

These changes may affect your projects when you switch from this repo's last Feathers _Auk_ version (v3.10.0) to its first Feathers _Buzzard_ version (v4.0.0).

- These hooks are deprecated and will be removed in the next FeathersJS version _Crow_.

  - Deprecated `pluck` in favor of `keep`, e.g. `iff(isProvider('external'),` `keep(...fieldNames))`. This deprecates the last hook with unexpected internal "magic". **Be careful!**
  - Deprecated `pluckQuery` in favor of `keepQuery` for naming consistency.
  - Deprecated `removeQuery` in favor of `discardQuery` for naming consistency.
  - Deprecated `client` in favor of `paramsFromClient` for naming consistency.
  - Deprecated `createdAt` and `updatedAt` in favor of `setNow`.
  - Deprecated `callbackToPromise` in favor of Node's `require('util').promisify`.
  - Deprecated `promiseToCallback` as there's probably no need for it anymore.

- Removed hooks previously deprecated in _Auk_.:

  - Removed support for the deprecated legacy syntax in `populate`.
  - Removed `remove`.

- The license now includes a clause which prevents the repo from being published on npm under another name. That is its only purpose; you can otherwise continue using the repo just as you have in the past.

<!--=============================================================================================-->
<h2 id="whats-new">What's New</h2>

The details are at <a href="https://github.com/feathers-plus/feathers-hooks-common/blob/master/CHANGELOG.md">Changelog.</a>

#### February 2018

- Buzzard version published as **npm** as v4.x.x.
- `alterItems` may now optionally return the items rather than modifying them in place.
- `disableMultiItemCreate` introduced. It prevents a service from creating multiple records in one service call.
- `mongoKeys` introduced for MongoDB services. Its wraps foreign keys found in `query` in ObjectID.

#### March 2018

- Documented how to [make any hook parameter dynamic](guide.html#Making-Hook-Params-Dynamic).
- `skipRemainingHooks` introduced. It conditionally skips running all remaining hooks.
- `actOnDispatch(...hooks)` and `actOnDefault(...hooks)`. You can use them to run most common hooks, and any hooks using `getItems` and `replaceItems` so they mutate `context.dispatch` rather than `context.data` or `context.result`.
- `mongoKeys` can now be used with any type of service call, not just `find`.

#### June 2018

- `discard` and `keep` support records which are `null`.
- A new, more convenient signature for async functions has been introduced for `alterItems`.
- `callingParams` and `callingParamsDefaults` utility functions added. `callingParams` should now be used rather than `makeCallingParams`.

#### July 2018

- `softDelete2` is a notable improvement over `softDelete`. It cooperates well with authentication and the `restrictToOwner` hook. Custom functions are supported for its probing get and removal patch calls. Hooks defined on these call methods will, by default,not be executed to eliminate interactions.

#### August 2018

- `keepInArray` For an array of objects, keeps selected field in each object. Contributed by Dekel Barzilay (dekelev).
