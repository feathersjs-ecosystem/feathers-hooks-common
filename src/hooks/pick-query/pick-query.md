---
title: pickQuery
description: Keep certain fields in the query object, deleting the rest.
category: hooks
hook:
  type: ['before', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

> **Note:** The keepQuery hook will remove any fields not specified even if the service is being called from the server. You may want to condition the hook to run only for external transports, e.g. `iff(isProvider('external'), keepQuery(...))`.

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                           |
| ---------- | ------------ | ----------------------------------------------------- |
| fieldNames | dot notation | The only fields you want to keep in the query object. |

## Example

```js
const { keepQuery } = require('feathers-hooks-common/index.js');

module.exports = { after: { create: keepQuery('name', 'address.city') } };
```

## Details

Updates `context.params.query`.
