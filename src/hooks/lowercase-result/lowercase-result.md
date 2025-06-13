---
title: lowercaseResult
description: Convert certain field values to lower case.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                                           |
| ---------- | ------------ | --------------------------------------------------------------------- |
| fieldNames | dot notation | The fields in the record(s) whose values are converted to lower case. |

## Example

```js
const { lowerCase } = require('feathers-hooks-common/index.js');

module.exports = { before: { create: lowerCase('email', 'username', 'div.dept') } };
```

## Details

Update either `context.data` (before hook) or `context.result[.data]` (after hook).
