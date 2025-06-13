---
title: paramsFromClient
description: Pass `context.params` from client to server. Server hook.
category: hooks
hook:
  type: ['before', 'around']
  method: ['all']
  multi: true
---

## Arguments

- `{Array< String > | String} whitelist`

| Argument    |     Type     | Default | Description                                                                                                  |
| ----------- | :----------: | ------- | ------------------------------------------------------------------------------------------------------------ |
| `whitelist` | dot notation |         | Names of the props permitted to be in `context.params`. Other props are ignored. This is a security feature. |

## Example

```js
// client
const { paramsForServer } = require('feathers-hooks-common/index.js');

service.update(
  id,
  data,
  paramsForServer({ query: { dept: 'a' }, populate: 'po-1', serialize: 'po-mgr' }),
);

// server
const { paramsFromClient } = require('feathers-hooks-common/index.js');

module.exports = {
  before: { all: [paramsFromClient('populate', 'serialize', 'otherProp'), myHook] },
};

// myHook's `context.params` will now be
// { query: { dept: 'a' }, populate: 'po-1', serialize: 'po-mgr' } }
```

## Details

By default, only the `context.params.query` object is transferred from a Feathers client to the server, for security among other reasons. However you can explicitly transfer other `context.params` props with the client utility function `paramsForServer` in conjunction with the `paramsFromClient` hook on the server.

This technique also works for service calls made on the server.
