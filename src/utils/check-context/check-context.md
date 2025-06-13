---
title: checkContext
description: Restrict a hook to run for certain methods and method types.
category: utils
---

## Arguments

- `{Object} context`
- `{String | Array< String >} [ type ]`
- `{String | Array< String >} [ methods ]`
- `{String} [ label ]`

| Argument  |   Type   | Default          | Description                       |
| --------- | :------: | ---------------- | --------------------------------- | --------------------------------------------------------------- |
| `context` | `Object` |                  | The hook context.                 |
| `type`    | `String  | Array< String >` | all types                         | The service type allowed - before, after, error.                |
| `methods` | `String  | Array< String >` | all methods                       | The service methods allowed - find, get, update, patch, remove. |
| `label`   | `String` | `'anonymous'`    | Name of hook to use with `throw`. |

## Example

```js
const { checkContext } = require('feathers-hooks-common/index.js');

function myHook(context) {
  checkContext(context, 'after', ['create', 'remove']);
  ...
}

module.exports = { before: {
    create: [ myHook ] // throws
} };

// checkContext(hook, 'before', ['update', 'patch'], 'hookName');
// checkContext(hook, null, ['update', 'patch']);
// checkContext(hook, 'before', null, 'hookName');
// checkContext(hook, 'before');
```

## Details

Its important to ensure the hook is being used as intended. `checkContext` let's you restrict the hook to a hook type and a set of service methods.
