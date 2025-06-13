---
title: isProvider
description: Check which transport provided the service call.
category: predicates
---

## Arguments

- `{Array< String >} transports`

| Name         |       Type        | Default | Description                       |
| ------------ | :---------------: | ------- | --------------------------------- |
| `transports` | `Array< String >` |         | The transports you want to allow. |

| `transports` |                Value                | Description |
| ------------ | :---------------------------------: | ----------- |
| `socketio`   | Allow calls by Socket.IO transport. |
| `rest`       |   Allow calls by REST transport.    |
| `external`   | Allow calls other than from server. |
| `server`     |      Allow calls from server.       |

**Returns**

- `{Boolean} result`

| Name   | Type    | Description                                    |
| ------ | ------- | ---------------------------------------------- |
| result | Boolean | If the call was made by one of the transports. |

## Example

```js
const { iff, isProvider, discard } = require('feathers-hooks-common/index.js');

module.exports = { after: { create: iff(isProvider('external'), discard('password')) } };
```

## Details

`isProvider` is a predicate function for use in conditional hooks. Its determines which transport provided the service call by checking `context.params.provider`.
