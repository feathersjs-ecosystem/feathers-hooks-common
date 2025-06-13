---
title: disallow
description: Prevents access to a service method completely or for specific transports.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['all']
  multi: true
  methods: ['all']
---

## Arguments

- `{Array< String >} transports`

| Argument     |       Type        | Default                 | Description                               |
| ------------ | :---------------: | ----------------------- | ----------------------------------------- |
| `transports` | `Array< String >` | disallow all transports | The transports that you want to disallow. |

| `transports` | Value                                 | Description |
| ------------ | ------------------------------------- | ----------- |
| `socketio`   | disallow calls by Socket.IO transport |
| `rest`       | disallow calls by REST transport      |
| `external`   | disallow calls other than from server |
| `server`     | disallow calls from server            |

## Example

```js
const { disallow, iff } = require('feathers-hooks-common/index.js');

module.exports = {
  before: {
    // Users can not be created by external access
    create: disallow('external'),
    // A user can not be deleted through the REST provider
    remove: disallow('rest'),
    // disallow calling `update` completely (e.g. to allow only `patch`)
    update: disallow(),
    // disallow the remove hook if the user is not an admin
    remove: iff(context => !context.params.user.isAdmin, disallow()),
  },
};
```

## Details

Prevents access to a service method completely or just for specific transports. All transports set the `context.params.provider` property, and `disallow` checks this.
