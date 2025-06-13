---
title: some
description: Return the or of a series of sync or async predicate functions.
category: predicates
---

## Arguments

- `{Array< Function >} predicates`

| Argument     |        Type         | Default | Description                                                                   |
| ------------ | :-----------------: | ------- | ----------------------------------------------------------------------------- |
| `predicates` | `Array< Function >` |         | Functions which take the current hook as a param and return a boolean result. |

**Returns**

- `{Boolean} result`

| Name   | Type    | Description                  |
| ------ | ------- | ---------------------------- |
| result | Boolean | The logical or of predicates |

## Example

```js
const { iff, some } = require('feathers-hooks-common/index.js');

module.exports = { before: {
    create: iff(some(hook1, hook2, ...), hookA, hookB, ...)
} };
```

## Details

`some` is a predicate function for use in conditional hooks. The predicate functions are run in parallel, and `true` is returned if any predicate returns a truthy value.
