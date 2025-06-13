---
title: disablePagination
description: Disable pagination when query.$limit is -1 or '-1'.
category: hooks
hook:
  type: ['before']
  method: ['find']
  multi: true
---

## Example

```js
const { disablePagination } = require('feathers-hooks-common/index.js');

module.exports = { before: { find: disablePagination() } };
```

## Details

Pagination is disabled if `context.query.$limit` is -1 or '-1'. It works for all types of calls including REST.
