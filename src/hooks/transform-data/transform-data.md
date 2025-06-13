---
title: transformData
description: Make changes to data or result items. Very flexible.
category: hooks
hook:
  type: ['before', 'around']
  method: ['create', 'update', 'patch', 'remove']
  multi: true
  source:
---

## Arguments

- `{Function} func`

| Argument |    Type    | Default                     | Description                                   |
| -------- | :--------: | --------------------------- | --------------------------------------------- |
| `func`   | `Function` | `(item,` `context) =>` `{}` | Function modifies `item` in place. See below. |

- **returns**

The mutated `item`. Returning `undefined` means the `item` in the parameters was mutated in place. returns result `undefined || item`

## Example

```js
const { alterItems } = require('feathers-hooks-common/index.js');

module.exports = { before: {
    all: [
      alterItems(rec => { delete rec.password; }) // Like `discard('password')`.
      alterItems(rec => rec.email = email.lowerCase()), // Like `lowerCase('email')`.
    ],
} };
```

Async mutations can be handled with async/await:

```js
alterItems(rec => {
  rec.userRecord = (async () => await service.get(...) )()
})
```

You can also perform async mutations using Promises by returning a Promise that is resolved once all mutations are complete:

```js
alterItems(rec => new Promise(resolve => {
  service.get(...).then(result => {
    rec.userRecord = result;
    resolve();
}});
```

You can also perform async mutations using Promises by returning a Promise that is resolved once all mutations are complete:

```js
alterItems(async rec => {
  rec.userRecord = await service.get(...);
})
```

## Details

The declarative nature of most of the common hooks, e.g. `discard('password')`, requires you to remember the names of a fair number of hooks, their parameters, and any possible nuances.

The `alterItems` hook offers an imperative alternative where you directly alter the items. It allows you to reduce the number of trivial hooks you have to register, and you are aware of exactly what your `alterItems` hooks do.

`func` is called for each item in `context.data` (before hook) or `context.result[.data]` (after hook). It receives the parameters

- `{Object} item`
- `{Object} context`

| Argument  |   Type   | Description                                                            |
| --------- | :------: | ---------------------------------------------------------------------- |
| `item`    | `Object` | The item. The function modifies it in place.                           |
| `context` | `Object` | The current context. It contains any alterations made to items so far. |

- **Returns**

  `func` may alternatively return a replacement `item` rather than `undefined`. This is a convenience feature which permits, for example, use of functions from the [Lodash](https://lodash.com/) library, as such functions tend to return new objects.
