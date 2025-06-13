---
title: iffElse
description: Execute one array of hooks or another based on a sync or async predicate.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{Function} predicate`
- `{Array< Functions >} hookFuncsTrue`
- `{Array< Functions >} hookFuncsFalse`

| Argument         |                Type                | Default | Description                                                                                                                                                                                                 |
| ---------------- | :--------------------------------: | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate`      | `Boolean`, `Promise` or `Function` |         | Determine if `hookFuncsTrue` or `hookFuncsFalse` should be run. If a function, `predicate` is called with the `context` as its param. It returns either a boolean or a Promise that evaluates to a boolean. |
| `hookFuncsTrue`  |       `Array<` `Function >`        |         | Sync or async hook functions to run if `true`. They may include other conditional hooks.                                                                                                                    |
| `hookFuncsFalse` |       `Array<` `Function >`        |         | Sync or async hook functions to run if `false`. They may include other conditional hooks.                                                                                                                   |

## Example

```js
const { iffElse, populate, serialize } = require('feathers-hooks-common/index.js');

module.exports = { after: {
  create: iffElse(() => { ... },
    [populate(poAccting), serialize( ... )],
    [populate(poReceiving), serialize( ... )]
  )
} };
```

## Details

Resolve the predicate, then run one set of hooks sequentially.

The predicate and hook functions will not be called with `this` set to the service, as is normal for hook functions. Use `hook.service` instead.
