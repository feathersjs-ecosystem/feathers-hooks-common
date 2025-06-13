---
title: every
description: Return the and of a series of sync or async predicate functions.
category: predicates
---

## Arguments

- `{Array< Function >} predicates`

| Argument     |        Type         | Default | Description                                                                   |
| ------------ | :-----------------: | ------- | ----------------------------------------------------------------------------- |
| `predicates` | `Array< Function >` |         | Functions which take the current hook as a param and return a boolean result. |

**Returns**

- `{Boolean} result`

| Name   | Type    | Description                   |
| ------ | ------- | ----------------------------- |
| result | Boolean | The logical and of predicates |

## Example

```js
const { iff, every } = require('feathers-hooks-common/index.js');

module.exports = { before: {
    create: iff(every(hook1, hook2, ...), hookA, hookB, ...)
} };
```

## Details

`every` is a predicate function for use in conditional hooks. The predicate functions are run in parallel, and `true` is returned if every predicate returns a truthy value.
