---
title: omitQuery
description: Delete certain fields from the query object.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['all']
  multi: true
---

> **Note:** The discardQuery hook will remove any fields not specified even if the service is being called from the server. You may want to condition the hook to run only for external transports, e.g. `iff(isProvider('external'), discardQuery(...))`.

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                           |
| ---------- | ------------ | ----------------------------------------------------- |
| fieldNames | dot notation | One or more fields you want to remove from the query. |

## Example

```js
const { discardQuery, iff, isProvider } = require('feathers-hooks-common/index.js');

module.exports = { after: { all: iff(isProvider('external'), discardQuery('secret')) } };
```

## Details

Delete the fields from `context.params.query`.
