## feathers-hooks-common

[![Build Status](https://travis-ci.org/feathersjs/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers.png)](https://codeclimate.com/github/feathersjs/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/feathersjs/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/feathersjs/feathers-hooks-common?branch=master)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-hooks-common)
[![Download Status](https://img.shields.io/npm/dm/feathers.svg?style=flat-square)](https://www.npmjs.com/package/feathers-hooks-common)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> Useful hooks for use with Feathers services.

## Migration to v3 from v2

Breaking changes:
- All hooks and utilities are obtained from `feathers-hooks-common`
rather than some from, say, `feathers-hooks-common/promisify`.
- Some functions supported a deprecated predicate as their last param.
This feature has been removed.
- The populate hook now ignores pagination on joined services by default.

Deprecated:
- The legacy populate hook -- with signtaure (string, ...) --
will be removed next version. Use the new `populate` hook.
- The `delete` hook should be used instead of `remove`.
You will need to wrap `delete` it in an conditional if you want it to work like `remove` does.
- The `stop` hook may be used instead of `disable`.
The `disable` hook when `false` instead of the documented `true`.

## Documentation

Refer to [Feathersjs documentation](https://docs.feathersjs.com)
for the coming [Auk](https://docs.feathersjs.com/v/auk/hooks/common.html) (preferable)
or the [current](https://docs.feathersjs.com/hooks/common.html) releases. 

## Installation

Run `npm install feathers-hooks-common --save` in your project folder.

## Tests

`npm test` to run tests.

## License

MIT. See LICENSE.
