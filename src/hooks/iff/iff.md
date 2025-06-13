---
title: iff
description: Execute one or another series of hooks depending on a sync or async predicate.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{Boolean | Promise | Function} predicate`
- `{Array< Function >} hookFuncsTrue`
- `{Array< Function >} hookFuncsFalse`

| Argument         |                Type                | Default | Description                                                                                                                                                                                                 |
| ---------------- | :--------------------------------: | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate`      | `Boolean`, `Promise` or `Function` |         | Determine if `hookFuncsTrue` or `hookFuncsFalse` should be run. If a function, `predicate` is called with the `context` as its param. It returns either a boolean or a Promise that evaluates to a boolean. |
| `hookFuncsTrue`  |       `Array<` `Function >`        |         | Sync or async hook functions to run if `true`. They may include other conditional hooks.                                                                                                                    |
| `hookFuncsFalse` |       `Array<` `Function >`        |         | Sync or async hook functions to run if `false`. They may include other conditional hooks.                                                                                                                   |

## Example

```js
const { discard, iff, isProvider, populate } = require('feathers-hooks-common/index.js');
const isNotAdmin = adminRole => context => context.params.user.roles.indexOf(adminRole || 'admin') === -1;

module.exports = { before: {
  create: iff(
    () => new Promise((resolve, reject) => { ... }),
    populate('user', { field: 'authorisedByUserId', service: 'users' })
  ),

  get: [ iff(isNotAdmin(), discard('budget')) ]

  update:
    iff(isProvider('server'),
      hookA,
      iff(isProvider('rest'), hook1, hook2, hook3)
      .else(hook4, hook5),
      hookB
    )
    .else(
      iff(hook => hook.path === 'users', hook6, hook7)
    )
} };
```

## Details

Resolve the predicate, then run one set of hooks sequentially.

The predicate and hook functions will not be called with `this` set to the service, as is normal for hook functions. Use `hook.service` instead.
