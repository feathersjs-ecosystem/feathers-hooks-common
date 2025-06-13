---
title: omitData
description: Delete certain fields from the record(s).
category: hooks
hook:
  type: ['before', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

> **Note:** The discard hook will remove fields even if the service is being called from the server. You may want to condition the hook to run only for external transports, e.g. `iff(isProvider('external'), discard(...))`.

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                               |
| ---------- | ------------ | --------------------------------------------------------- |
| fieldNames | dot notation | One or more fields you want to remove from the record(s). |

## Example

```js
const { discard, iff, isProvider } = require('feathers-hooks-common/index.js');

module.exports = {
  after: { all: iff(isProvider('external'), discard('password', 'address.city')) },
};
```

## Details

Delete the fields either from `context.data` (before hook) or `context.result[.data]` (after hook).
They are not modified if they are not an object, so a `null` value is supported.
