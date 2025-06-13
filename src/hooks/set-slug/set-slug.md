---
title: setSlug
description: Set slugs in URL, e.g. /stores/:storeId.
category: hooks
hook:
  type: ['before', 'after', 'around']
  method: ['all']
  multi: true
---

## Arguments

- `{String} slug`
- `{String} [ fieldName ]`

| Argument    |   Type   | Default       | Description                                                                        |
| ----------- | :------: | ------------- | ---------------------------------------------------------------------------------- |
| `slug`      | `String` |               | The slug as it appears in the route, e.g. `storeId` for`/stores/:storeId/candies`. |
| `fieldName` | `String` | `query[slug]` | The field to contain the slug value.                                               |

## Example

```js
const { setSlug } = require('feathers-hooks-common/index.js');

module.exports = { before: { all: [hooks.setSlug('storeId')] } };

// `context.params.query` will always be normalized,
// e.g. `{ size: 'large', storeId: '123' }`
```

## Details

A service may have a slug in its URL, e.g. `storeId` in `app.use(` `'/stores/:storeId/candies',` `new Service());`. The service gets slightly different values depending on the transport used by the client.

| transport | `hook.data` `.storeId` | `hook.params` `.query`                | code run on client                                                                           |
| --------- | ---------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| socketio  | `undefined`            | `{ size: 'large',` `storeId: '123' }` | `candies.create({ name: 'Gummi',qty: 100 },` `{ query: { size: 'large', storeId: '123' } })` |
| rest      | `:storeId`             | same as above                         | same as above                                                                                |
| raw HTTP  | `123`                  | `{ size: 'large' }`                   | `fetch('/stores/123/candies?size=large', ..`                                                 |

This hook normalizes the difference between the transports.
