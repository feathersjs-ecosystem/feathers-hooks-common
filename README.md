## feathers-hooks-common

### WIP Changes:

- added alterData, alterResult, deprecated alterItems
- added discardData, discardResult, deprecated discard
  - moved to omitData, omitResult, deprecated omit
- added keepData, keepResult, deprecated keep
  - moved to pickData, pickResult, deprecated pick
- added lowercaseData, lowercaseResult, deprecated lowercase
- added setNowData, setNowResult, deprecated setNow

- added getDataIsArray, getResultIsArray, deprecated getItems
- added replaceData, replaceResult, deprecated replaceItems

- removed several checks that are handled by typescript
- removed check for `preventChanges(true, ...fieldNames)`

- renamed 'keepQuery' to 'pickQuery', added alias

- added utils from feathers-utils

  - allowsMulti
  - getPaginate
  - isMulti
  - isPaginated
  - setResultEmpty

- stashBefore multi

<p align="center">
  <img src="https://hooks-common.feathersjs.com/feathers-hooks-common-logo.png" width="200">
</p>

[![npm](https://img.shields.io/npm/v/feathers-hooks-common)](https://www.npmjs.com/package/feathers-hooks-common)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/feathersjs-ecosystem/feathers-hooks-common/CI/master)](https://github.com/feathersjs-ecosystem/feathers-hooks-common/actions/workflows/nodejs.yml?query=branch%3Amaster)
[![libraries.io](https://img.shields.io/librariesio/release/npm/feathers-hooks-common)](https://libraries.io/npm/feathers-hooks-common)
[![npm](https://img.shields.io/npm/dm/feathers-hooks-common)](https://www.npmjs.com/package/feathers-hooks-common)
[![GitHub license](https://img.shields.io/github/license/feathersjs-ecosystem/feathers-hooks-common)](https://github.com/feathersjs-ecosystem/feathers-hooks-common/blob/master/LICENSE)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/qa8kez8QBx)

A collection of useful hooks to use with Feathers services.

> NOTE: This is the version for Feathers v5. For Feathers v4 use [feathers-hooks-common v6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/crow)

```
npm install feathers-hooks-common --save
```

## Documentation

For the full list and API of available hooks and utilities, refer to the [feathers-hooks-common documentation](https://hooks-common.feathersjs.com/overview.html).

## Tests

`npm test` to run tests.

## License

See [LICENSE](LICENSE).
