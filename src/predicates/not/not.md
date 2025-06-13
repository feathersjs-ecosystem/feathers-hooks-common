---
title: not
description: Negate a sync or async predicate function.
category: predicates
---

## Arguments

- `{Function | Boolean} predicate`

| Argument    |         Type         | Default | Description                                                                                   |
| ----------- | :------------------: | ------- | --------------------------------------------------------------------------------------------- |
| `predicate` | `Function` `Boolean` |         | A sync or async function which take the current hook as a param and returns a boolean result. |

**Returns**

- `{Boolean} result`

| Name   | Type    | Description          |
| ------ | ------- | -------------------- |
| result | Boolean | The not of predicate |

## Example

```js
const { iff, isNot, isProvider, discard } = require('feathers-hooks-common/index.js');
const isRequestor = () => context => new Promise(resolve, reject) => ... );

module.exports = { after: {
    create: iff(isNot(isRequestor()), discard('password'))
} };
```

## Details

`isNot` is a predicate function for use in conditional hooks.
