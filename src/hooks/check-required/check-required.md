---
title: checkRequired
description: Check selected fields exist and are not falsey. Numeric 0 is acceptable.
category: hooks
hook:
  type: ['before', 'around']
  method: ['create', 'update', 'patch']
  multi: true
---

- Arguments
  - `{Array < String >} fieldNames`

| Name       | Type         | Description                                                         |
| ---------- | ------------ | ------------------------------------------------------------------- |
| fieldNames | dot notation | These fields must exist and not be falsey. Numeric 0 is acceptable. |

## Example

```js
const { required } = require('feathers-hooks-common/index.js');

module.exports = { before: { all: required('email', 'password') } };
```
