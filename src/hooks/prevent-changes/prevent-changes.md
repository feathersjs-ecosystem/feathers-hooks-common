---
title: preventChanges
description: Prevent patch service calls from changing certain fields.
category: hooks
hook:
  type: ['before', 'around']
  method: ['patch']
  multi: true
---

## Arguments

- `{Boolean} ifThrow`
- `{Array < String >} fieldNames`

| Argument     |     Type     | Default | Description                                            |
| ------------ | :----------: | ------- | ------------------------------------------------------ |
| `ifThrow`    |  `Boolean`   |         | Deletes any `fieldNames` if `false`; throws if `true`. |
| `fieldNames` | dot notation |         | The fields names which may not be patched.             |

## Example

```js
const { preventChanges } = require('feathers-hooks-common/index.js');

module.exports = { before: { patch: preventChanges(true, 'security.badge') } };
```

## Details

Consider using validateSchema if you would rather specify which fields are allowed to change.
