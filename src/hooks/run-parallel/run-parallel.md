---
title: runParallel
description: Run a hook in parallel to the other hooks and the service call.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{Function} hookFunc`
- `{Function} clone`
- `{Number} [ depth ]`

| Argument   |    Type    | Default | Description                                                                                                         |
| ---------- | :--------: | :-----: | ------------------------------------------------------------------------------------------------------------------- |
| `hookFunc` | `Function` |         | The hook function to run in parallel to the rest of the service call.                                               |
| `clone`    | `Function` |         | Function to deep clone its only parameter.                                                                          |
| `depth`    |  `Number`  |    6    | Depth to which `context` is to be cloned. 0 does not clone. A depth of 5 would clone `context.result.data.[].item`. |

## Example

```js
const { runParallel } = require('feathers-hooks-common/index.js');
const clone = require('clone');

function sendEmail(...) {
  return context => { ... };
}

module.exports = { after: {
  create: runParallel(sendEmail(...), clone)
} };
```

## Details

`hookFunc` is scheduled with a `setTimeout`. The next hook starts immediately.

The hook was provided by bedeoverend. Thank you.
