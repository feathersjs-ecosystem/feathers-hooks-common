---
title: combine
description: Sequentially execute multiple sync or async hooks.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{Array< Function >} hookFuncs`

| Argument    |        Type        | Default | Description                                         |
| ----------- | :----------------: | ------- | --------------------------------------------------- |
| `hookFuncs` | `Array<Function >` |         | Hooks, used the same way as when you register them. |

## Example

```js
const { combine, createdAt, updatedAt } = require('feathers-hooks-common/index.js');

async function myCustomHook(context) {
  const newContext = await combine(setNow('createdAt'), setNow('updatedAt')).call(this, context);
  return newContext;
}
```

## Details

`combine` has the signature of a hook, but is primarily intended to be used within your custom hooks, not when registering hooks.

The following is a better technique to use when registering hooks.

```js
const workflow = [createdAt(), updatedAt(), ...];

module.exports = { before: {
  update: [...workflow],
  patch: [...workflow],
} };
```
