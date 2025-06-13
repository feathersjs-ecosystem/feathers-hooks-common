---
title: setField
description: The `setField` hook allows to set a field on the hook context based on the value of another field on the hook context.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['all']
  multi: true
---

### Options

- `from` _required_ - The property on the hook context to use. Can be an array (e.g. `[ 'params', 'user', 'id' ]`) or a dot separated string (e.g. `'params.user.id'`).
- `as` _required_ - The property on the hook context to set. Can be an array (e.g. `[ 'params', 'query', 'userId' ]`) or a dot separated string (e.g. `'params.query.userId'`).
- `allowUndefined` (default: `false`) - If set to `false`, an error will be thrown if the value of `from` is `undefined` in an external request (`params.provider` is set). On internal calls (or if set to true `true` for external calls) the hook will do nothing.

> **Important:** This hook should be used after the [authenticate hook](https://docs.feathersjs.com/api/authentication/hook.html#authenticate-options) when accessing user fields (from `params.user`).

**Note:** When the service enable `multi:true` and `data` is an array data type, this hook may working to an unexpected result

### Examples

Limit all external access of the `users` service to the authenticated user:

> **Note:** For MongoDB, Mongoose and NeDB `params.user.id` needs to be changed to `params.user._id`. For any other custom id accordingly.

```js
const { authenticate } = require('@feathersjs/authentication');
const { setField } = require('feathers-hooks-common/index.js');

app.service('users').hooks({
  before: {
    all: [authenticate('jwt'), setField({ from: 'params.user.id', as: 'params.query.id' })],
  },
});
```

Only allow access to invoices for the users organization:

```js
const { authenticate } = require('@feathersjs/authentication');
const { setField } = require('feathers-hooks-common/index.js');

app.service('invoices').hooks({
  before: {
    all: [
      authenticate('jwt'),
      setField({ from: 'params.user.organizationId', as: 'params.query.organizationId' }),
    ],
  },
});
```

Set the current user id as `userId` when creating a message and only allow users to edit and remove their own messages:

```js
const { authenticate } = require('@feathersjs/authentication');
const { setField } = require('feathers-hooks-common/index.js');

const setUserId = setField({
  from: 'params.user.id',
  as: 'data.userId'
});
const limitToUser = setField({
  from: 'params.user.id',
  as: 'params.query.userId'
});

app.service('messages').hooks({
  before: {
    all: [
      authenticate('jwt')
    ],
    create: [
      setUserId
    ],
    patch: [
      limitToUser
    ],
    update: [
      limitToUser
    ]
    remove: [
      limitToUser
    ]
  }
})
```
