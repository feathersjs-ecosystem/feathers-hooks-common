---
title: stashBefore
description: Stash current value of record, usually before mutating it. Performs a get call.
category: hooks
hook:
  type: ['before', 'around']
  method: ['get', 'update', 'patch', 'remove']
  multi: true
---

## Arguments

- `{String} fieldName`

| Argument    | Type | Default    | Description                                                                    |
| ----------- | :--: | ---------- | ------------------------------------------------------------------------------ |
| `fieldName` |      | `'before'` | The name of the `context.params` property to contain the current record value. |

## Example

```js
const { stashBefore } = require('feathers-hooks-common/index.js');

module.exports = { before: { patch: stashBefore() } };
```

## Details

The hook performs its own preliminary `get` call. If the original service call is also a `get`, its `context.params` is used for the preliminary `get`. The preliminary `get` will be skipped if `params.disableStashBefore` is truthy.

For any other method the calling params are formed from the original calling context:

```js
{ provider: context.params.provider,
  authenticated: context.params.authenticated,
  user: context.params.user }
```
