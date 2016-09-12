## feathers-hooks-common

Useful hooks for use with Feathersjs services.

[![Build Status](https://travis-ci.org/feathersjs/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/feathersjs/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/feathersjs/feathers-hooks-common?branch=master)

## Code Examples

- [Data Items](#dataItems)
- [Query Params](#queryParams)
- [Authorization](#authorization)
- [Database](#database)
- [Utilities](#utilities)
- [Conditional hooks](#conditionalHooks)
- [Utilities for Writing Hooks](#hookUtils)

## <a name="dataItems"></a> Data Items

(1) Join a related item to result (after hook).

- Supports multiple result items, including paginated `find`.
- Supports key field with an array of keys.
- Supports multiple joins.

```javascript
const hooks = require('feathers-hooks-common');
module.exports.after = {
  // add prop 'user' containing the user item who's key is in 'senderId'.
  all: [ hooks.populate('user', { field: 'senderId', service: '/users' }) ]
};
```

(2) Remove fields from data.

- Field names support dot notation e.g. 'name.address.city'
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.remove('verifyToken', 'verifyExpires', (hook) => true) ]
};
```

(3) Retain only selected fields in data.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.pluck('employee.name', 'employee.email',
           (hook) => new Promise(resolve => setTimeout(() => resolve(true), 100)) ]
};
```

(4) Convert fields to lower case.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.lowerCase('email') ]
};
```

(5) Add created at timestamp.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  create: [ hooks.setCreatedAt('createdAt') ]
};
```

(6) Add or update the updated at timestamp.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  create: [ hooks.setUpdatedAt('updatedAt') ]
};
```

## <a name="queryParams"></a> Query Params

(1) Remove criteria from query (before hook).

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  all: [ hooks.removeQuery('sex') ]
};
```

(2) Retain only selected criteria in query (before hook).

- Field names support dot notation.
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  all: [ hooks.removeQuery('employee.dept') ]
};
```

## <a name="validation"></a> Validation

Fidelity and code reuse are improved if the server can rerun validation code written
for the front-end.

- Support is provided for sync, callback and promise based validation routines.
- Optionally replace the data with sanitized values.

(1) Invoke a synchronous validation routine (before; create, update, patch).

```javascript
const usersClientValidation = (values) => values.email ? null : { email: 'Email is invalid' };

module.exports.before = {
  create: [ hooks.validateSync(usersClientValidations) ] // redo client sync validation
};
```

(2) Invoke a callback based validation routine (before; create, update, patch).

```javascript
const usersServerValidation = (values, param2, cb) => {
  setTimeout(() => {
    values.email.trim()
      ? cb(null, { ...values, email: values.email.trim() }) // sanitize data
      : cb({ email: 'Email is invalid' });
  }, 100);
};

module.exports.before = {
  create: [ hooks.validateUsingCallback(usersServerValidations, 'value4param2') ] // server only
};
```

(3) Invoke a promise based validation routine (before; create, update, patch).

```javascript
const usersServerValidation = (values, ...rest) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      values.email.trim()
        ? resolve({ ...values, email: values.email.trim() })
        : reject(new errors.BadRequest({ email: 'Email is invalid' }));
    }, 100);
  })
);

module.exports.before = {
  create: [ hooks.validateUsingPromise(usersClientAsync) ] // redo client async validation
};
```

#### Note:

The structure of the data object should be checked before any validation is performed.
Several schema validation packages
[are available](http://docs.feathersjs.com/why/showcase.html#validation).

## <a name="authorization"></a> Authorization

(1) Disable hook

- Disable service completely, from all external providers, or from certain providers.
- Service be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  patch: [ hooks.disable('socketio', 'rest') ],
  create: [ hooks.disable((hook) => new Promise(resolve => resolve(true) )) ]
};
```

(2) Authorize access by role.
Convenience wrapper for `feathers-authentication.hooks.restrictToRoles`.

- Clean, clear and DRY.
    
```javascript
const authorizer = hooks.restrictToRoles(['inv', 'ship'], 'userAuthorizedRoles', false, 'userId');

module.exports.before = {
  all: [ authorizer() ]
  create: [ authorizer(['purch']) ]
};
```

## <a name="database"></a> Database

(1) Mark items as deleted rather than removing them from the database. **(ALPHA)**

```javascript
export.before = {
  remove: [ softDelete() ], // update item flagging it as deleted
  find: [ softDelete() ] // ignore deleted items
};
```

## <a name="utilities"></a> Utilities

(1) Normalize the URL slug (before).

Copy the slug from raw HTTP requests, e.g. https://.../stores/:storeid/...
to where other providers typically store it. Dot notation is supported.

```javascript
module.exports.before = {
  create: [ hooks.setSlug('storeid') ]
};
```

(2) Display current info about the hook to console.

```javascript
module.exports.after = {
  create: [ hooks.setUpdatedAt('step 1') ]
};
// * step 1
// type: before, method: create
// data: { name: 'Joe Doe' }
// query: { sex: 'm' }
// result: { assigned: true }
```

## <a name="conditionalHooks"></a> Running hooks conditionally

There are times when you may want to run a hook conditionally,
perhaps depending on the provider, the user authorization,
if the user created the record, etc.

A custom service may be designed to always be called with the `create` method,
with a data value specifying the action the service is to perform.
Certain actions may require authentication or authorization,
while others do not.

(1) Conditionally run a hook (before, after).

Run a predicate function,
which returns either a boolean, or a Promise which evaluates to a boolean.
Run the hook if the result is truesy.

```javascript
// sync predicate and hook
hooks.iff(
  () => params.user.roles.includes('admin') === -1,
  hooks.remove('securityKey')
);
// async predicate and hook
hooks.iff(
  () => new Promise((resolve, catch) => { ... }),
  hooks.populate('user', { field: 'senderId', service: '/users' })
);
```

(2) Predicate for which provider called the service method.

```javascript
hooks.iff(!hooks.isProvider('server'), hooks.remove( ... )) // also socketio, external, rest, primus
```

## <a name="hookUtils"></a> Utilities for Writing Hooks

These utilities may be useful when you are writing your own hooks.
You can import them from `feathers-hooks-common/lib/utils`.

(1) Get and replace the items in the hook.

- Handles before and after types.
- Handles paginated and non-paginated results from find.

```javascript```
import { getItems, replaceItems } from 'feathers-hooks-common/lib/utils';
export.before = { create: [ (hook) => {
  ...
  const items = getItems(hook);
  Array.isArray(items) ? items[0].code = 'a' : items.code = 'a';
  replaceItems(hook, items);
  ...
}]};
```

(2) Throw if a hook is used wrongly.

```javascript
import { checkContext } from 'feathers-hooks-common/lib/utils';
function myHook(hook) {
  checkContext(hook, 'before', ['create', 'remove']);
  ...
}
export.after = { create: [ myHook ]}; // throws
```

(3) Support dot notation in field access.

- Optionally deletes properties in object.

```javascript
import { getByDot, setByDot } from 'feathers-hooks-common/lib/utils';
export.before = { create: [ (hook) => {
  ...
  const city = getByDot(hook.data, 'person.address.city');
  setByDot(hook, 'data.person.address.city', 'London');
  ...
}]};
```

## <a name="motivation"></a> Motivation

Feathers [services](http://docs.feathersjs.com/services/readme.html)
can be developed faster if the
[hooks](http://docs.feathersjs.com/hooks/readme.html)
you need are at hand.

This package provides some commonly needed hooks.

## <a name="installation"></a> Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-common --save` in your project folder.

`/src` on GitHub contains the ES6 source. It will run on Node 6+ without transpiling.

## <a name="apiReference"></a> API Reference

Each file in `/src` fully documents its exports.

See also the [Featherjs docs](http://docs.feathersjs.com/hooks/bundled.html#built-in-hooks).

## <a name="tests"></a> Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## <a name="contribution"></a> Contributing

[Contribute to this repo.](./CONTRIBUTING.md)

[Guide to ideomatic contributing.](https://github.com/jonschlinkert/idiomatic-contributing)

## <a name="changeLog"></a> Change Log

[List of notable changes.](./CHANGELOG.md)

## <a name="license"></a> License

MIT. See LICENSE.