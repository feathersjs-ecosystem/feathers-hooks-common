---
title: unless
description: Execute a series of hooks if a sync or async predicate is falsey.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{Boolean | Promise | Function} predicate`
- `{Array< Function >} hookFuncs`

| Argument    |                Type                | Default | Description                                                                                                                                                                             |
| ----------- | :--------------------------------: | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | `Boolean`, `Promise` or `Function` |         | Run `hookFunc` if the `predicate` is false. If a function, `predicate` is called with the `context` as its param. It returns either a boolean or a Promise that evaluates to a boolean. |
| `hookFuncs` |       `Array<` `Function >`        |         | Sync or async hook functions to run if `true`. They may include other conditional hooks.                                                                                                |

## Example

```js
const { isProvider, unless } = require('feathers-hooks-common/index.js');

module.exports = {
  before: {
    create: unless(
      isProvider('server'),
      hookA,
      unless(isProvider('rest'), hook1, hook2, hook3),
      hookB,
    ),
  },
};
```

## Details

Resolve the predicate to a boolean. Run the hooks sequentially if the result is falsey.

The predicate and hook functions will not be called with `this` set to the service, as is normal for hook functions. Use `hook.service` instead.
