---
title: traverse
description: Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['find', 'get', 'create', 'update', 'patch', 'remove']
  multi: true
---

## Arguments

- `{Function} transformer`
- `{Function} [ getObject ]`

| Argument      |    Type    | Default                                   | Description                                                                   |
| ------------- | :--------: | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `transformer` | `Function` |                                           | Called for every node in every record(s). May change the node in place.       |
| `getObject`   | `Function` | `context.data` or `context.result[.data]` | Function with signature `context => {}` which returns the object to traverse. |

## Example

```js
const { traverse } = require('feathers-hooks-common/index.js');

// Trim strings
const trimmer = function (node) {
  if (typeof node === 'string') {
    this.update(node.trim());
  }
};

// REST HTTP request may use the string 'null' in its query string.
// Replace these strings with the value null.
const nuller = function (node) {
  if (node === 'null') {
    this.update(null);
  }
};

module.exports = {
  before: { create: traverse(trimmer), find: traverse(nuller, context => context.params.query) },
};
```

## Details

Traverse and transform objects in place by visiting every node on a recursive walk. Any object in the hook may be traversed, including the query object.

> [traverse (NPM)](https://npmjs.com/package/traverse) documents the extensive methods and context available to the transformer function.
