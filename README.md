## feathers-hooks-common

Useful hooks for use with Feathersjs services.

[![Build Status](https://travis-ci.org/eddyystop/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/eddyystop/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/eddyystop/feathers-hooks-common?branch=master)

## Data Items

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

```javascript
module.exports.before = {
  create: [ hooks.setCreatedAt({ as: 'createdAt' }) ] // added to hook.data
};
```

(6) Add or update the updated at timestamp.

```javascript
module.exports.before = {
  create: [ hooks.setUpdatedAt({ as: 'updatedAt' }) ], // added to hook.data
  update: [ hooks.setUpdatedAt({ as: 'updatedAt' }) ], // added to hook.data.$set
  patch: [ hooks.setUpdatedAt({ as: 'updatedAt' }) ]
};
```

## Query params

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

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  all: [ hooks.removeQuery('employee.dept') ]
};
```

## Validation

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

See `feathers-starter-react-redux-login` for a working example of schema and hook validation.

## Authorization

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

## Utilities

(1) Normalize the URL slug (before).

Copy the slug from raw HTTP requests, e.g. https://.../stores/:storeid/...,
to `hooks.parms.query` which is where other providers typically store it.

```javascript
module.exports.before = {
  create: [ hooks.setSlug('storeid') ], // slug value at hook.params.query.storeid
  update: [ hooks.setSlug('storeid') ],
  patch: [ hooks.setSlug('storeid') ]
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



See `feathers-starter-react-redux-login` for a working example of validation hooks.

## Motivation

Feathers [services](http://docs.feathersjs.com/services/readme.html)
can be developed faster if the
[hooks](http://docs.feathersjs.com/hooks/readme.html)
you need are at hand.

This package provides some commonly needed hooks.

## Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-common --save` in your project folder.

`/src` on GitHub contains the ES6 source. It will run on Node 6+ without transpiling.

## API Reference

Each file fully documents its module's API.

## Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## Contributing

To do.

## License

MIT. See LICENSE.