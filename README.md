## feathers-hooks-common

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/feathers-hooks-common.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers.png)](https://codeclimate.com/github/feathersjs/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/feathersjs/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/feathersjs/feathers-hooks-common?branch=master)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-hooks-common)
[![Download Status](https://img.shields.io/npm/dm/feathers.svg?style=flat-square)](https://www.npmjs.com/package/feathers-hooks-common)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> Useful hooks for use with Feathers services.

---

> Use feathers-hooks-common v3.10.0 with FeathersJS v3 (Auk).

> Use feathers-hooks-common v4.x.x with FeathersJS v4 (Buzzard).

## Migration to v4 (for FeathersJS v2 Auk) from v3 (for FeathersJSv3 Buzzard).

  - Docs moved to [feathers-plus web site.](https://feathers-plus.github.io/v1/feathers-hooks-common/guide.html)
  
  - v4.x.x now supports FeathersJS v3 (Buzzard). Continue using v3.10.0 for FeathersJS v2 (Auk).
    - Removed:
      - Removed support for the deprecated legacy syntax in `populate`.
      - Removed the deprecated `remove` hook.
      
    - Deprecated. These will be removed in FeathersJS v3 (Crow).
      - Deprecated `pluck` in favor of `iff(isProvider('external'),` `keep(...fieldNames))`. **Be careful!**
      - Deprecated the `client` in favor of the `paramsFromClient`.
      
    - Added modules. They work with both FeathersJS v2 and v3.
      - `fastJoin` hook - Very fast alternative to `populate`.
      - `makeCallingParams` utility - Help construct `context.params` when calling services.

## Documentation

Refer to [Feathers-Plus web site.](https://feathers-plus.github.io/v1/feathers-hooks-common/guide.html). 

## Installation

Run `npm install feathers-hooks-common --save` in your project folder (installs the latest v2 release).

## Tests

`npm test` to run tests.

## License

See LICENSE.
