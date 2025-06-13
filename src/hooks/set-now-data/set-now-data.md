---
title: setNowData
description: Create/update certain fields to the current date-time.
category: hooks
hook:
  type: ['before', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                                      |
| ---------- | ------------ | ---------------------------------------------------------------- |
| fieldNames | dot notation | The fields that you want to add or set to the current date-time. |

## Example

```js
const { setNow } = require('feathers-hooks-common/index.js');

module.exports = { before: { create: setNow('createdAt', 'updatedAt') } };
```

## Details

Update either `context.data` (before hook) or `context.result[.data]` (after hook).
