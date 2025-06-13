---
title: debug
description: Display the current hook context for debugging.
category: hooks
hook:
  type: ['before', 'after']
  method: ['all']
  multi: true
---

## Arguments

- `{String} label`
- `{Array < String >} [ fieldNames ]`

| Argument     |     Type     | Default | Description                                      |
| ------------ | :----------: | ------- | ------------------------------------------------ |
| `label`      |   `String`   |         | Label to identify the logged information.        |
| `fieldNames` | dot notation |         | The field values in `context.params` to display. |

## Example

```js
const { debug } = require('feathers-hooks-common/index.js');

module.exports = { before: {
    all: [ debug('step 1'), setNow('updatedAt'), debug(' step 2') ],
} };

// Result
* step 1
type: before, method: create
data: { name: 'Joe Doe' }
query: { sex: 'm' }
result: { assigned: true }
params props: [ 'query' ]
* step 2
type: before, method: create
data: { name: 'Joe Doe', createdAt: 1510518511547 }
query: { sex: 'm' }
result: { assigned: true }
params props: [ 'query' ]
params.query: { sex: 'm' }
error: ...
```

## Details

`debug` is great for debugging issues with hooks. Log the hook context before and after a hook to see what the hook started with, and what it changed.
