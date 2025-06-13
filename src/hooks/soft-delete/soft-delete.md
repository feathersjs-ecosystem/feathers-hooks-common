---
title: softDelete
description: Flag records as logically deleted instead of physically removing them. Requires a Feathers v4 or later database adapter.
category: hooks
hook:
  type: ['before', 'around']
  method: ['find', 'get', 'create', 'update', 'patch', 'remove']
  multi: true
---

## Arguments

| Argument       | Type      | Default | Description                  |                                                                                                                |
| -------------- | --------- | ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `deletedQuery` | `Function | Object` | `{ deleted: { $ne: true } }` | An object or async function that takes the query which returns the part of the query to exclude deleted entrie |
| `removeData`   | `Function | Object` | `{ deleted: true }`          | An object or async function that returns the data used to flag an entry as deleted                             |

By default, `softDelete` queries for a `deleted` property not set to `true` (meaning it can either exist or be anything else).

Setting `params.disableSoftDelete` to `true` allows to skip the `softDelete` hook.

## Example

Basic usage:

```js
const { softDelete } = require('feathers-hooks-common/index.js');

// Use standard softDelete which uses `deleted: true`
app.service('people').hooks({ before: { all: [softDelete()] } });

//  will set `deleted: true` for entry with id 1
app.service('people').remove(1);

// Will find all people where `deleted` is not `true`
let people = app.service('people').find();

// `get`, `patch`, `update` or `remove` on a deleted entry will throw NotFound
app.service('people').get(1);
```

Customizing `deletedQuery` and `removeData` to e.g. use `deletedAt`:

```js
// Use deletedAt and set when the entry was deleted
app.service('people').hooks({
  before: {
    all: [
      hooks.softDelete({
        // context is the normal hook context
        deletedQuery: async context => {
          return { deletedAt: null };
        },
        removeData: async context => {
          return { deletedAt: new Date() };
        },
      }),
    ],
    create: [
      context => {
        context.data.deletedAt = null;
      },
    ],
  },
});
```
