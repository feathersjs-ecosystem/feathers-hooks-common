---
title: pickData
description: Keep certain fields in the record(s), deleting the rest.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

> **Note:** The keep hook will remove any fields not specified even if the service is being called from the server. You may want to condition the hook to run only for external transports, e.g. `iff(isProvider('external'), keep(...))`.

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                        |
| ---------- | ------------ | -------------------------------------------------- |
| fieldNames | dot notation | The only fields you want to keep in the record(s). |

## Example

```js
const { keep } = require('feathers-hooks-common/index.js');

module.exports = { after: { create: keep('name', 'dept', 'address.city') } };
```

## Details

Update either `context.data` (before hook) or `context.result[.data]` (after hook).
Their values are returned if they are not an object, so a `null` value is supported.
