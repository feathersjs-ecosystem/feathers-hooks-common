'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCreatedAt = setCreatedAt;
exports.setUpdatedAt = setUpdatedAt;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-env es6, node */
/* eslint  max-len: 0, no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

var authHooks = require('feathers-authentication').hooks;
var errors = require('feathers-errors');
var utils = require('feathers-hooks-utils');
var utils2 = require('./utils');

var setByDot = utils2.setByDot;

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fields - Field names.
 *    One or more fields may be set to the date-time. Dot notation is supported.
 *    The default is createdAt if no fields names are included.
 * @returns {Function} hook function(hook).
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.setCreatedAt('madeAt', hook => hook.data.status === 1);
 * hooks.setCreatedAt(hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */

function setCreatedAt() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  var addFields = function addFields(data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        setByDot(data, field, new Date());
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function () {
    return true;
  };

  if (!fields.length) {
    fields = ['createdAt'];
  }

  return function (hook) {
    var items = hook.type === 'before' ? hook.data : hook.result;

    var update = function update(condition) {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(addFields);
        } else {
          addFields(items);
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fields - Field names.
 *    One or more fields may be set to the date-time. Dot notation is supported.
 *    The default is updatedAt if no fields names are included.
 * @returns {Function} hook function(hook).
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.setCreatedAt('madeAt', hook => hook.data.status === 1);
 * hooks.setCreatedAt(hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */

function setUpdatedAt() {
  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fields[_key2] = arguments[_key2];
  }

  var addFields = function addFields(data) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var field = _step2.value;

        setByDot(data, field, new Date());
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  var callback = typeof fields[fields.length - 1] === 'function' ? fields.pop() : function () {
    return true;
  };

  if (!fields.length) {
    fields = ['updatedAt'];
  }

  return function (hook) {
    var items = hook.type === 'before' ? hook.data : hook.result;

    var update = function update(condition) {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(addFields);
        } else {
          addFields(items);
        }
      }
      return hook;
    };

    var check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Normalize slug, so it can be accessed in the same place regardless of provider and transport.
 *
 * @param {string} slug - The slug, e.g. 'storeId' for http://.../stores/:storeId/...
 * @param {?string} field - where in hook.params to copy the URL slug. Dot notation is supported.
 *    hook.params.query[storeId] is the default location.
 * @returns {Function} hook function(hook)
 *
 * A service may have a slug in its path e.g. app.use('/stores/:storeId/candies', new Service());
 * The service gets slightly different values depending on the transport used by the client.
 *
 * hook.params.
 * transport         storeId   hook.params.query                 code on client
 * ----------------- --------- --------------------------------- ------------------------
 * feathers-socketio undefined { size: 'large', storeId: '123' } candies.create({ name: 'Gummi', qty: 100 }, { query: { size: 'large', storeId: '123' } }, cb)
 * feathers-rest     :storeId  { size: 'large', storeId: '123' } ... same as above
 * raw HTTP          123       { size: 'large' }                 fetch('/stores/123/candies?size=large', ...
 *
 * This hook normalizes the difference between the transports. A hook of
 * all: [ hooks.setSlug('storeId') ]
 * provides a normalized hook.params.query of { size: 'large', storeId: '123' } for the above.
 *
 * module.exports.before = {
 *   all: [ hooks.setSlug('storeId') ]
 * };
 */
module.exports.setSlug = function (slug, field) {
  return function (hook) {
    if (typeof field !== 'string') {
      field = 'query.' + slug;
    }

    if (hook.type === 'after') {
      throw new errors.GeneralError('Cannot set slug on after hook. (setSlug)');
    }

    if (hook.params && hook.params.provider === 'rest') {
      var value = hook.params[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        setByDot(hook.params, field, value);
      }
    }
  };
};

/**
 * Display debug info in hooks
 *
 * @param {string} msg - Message to display.
 * @returns {Function} hook function(hook)
 *
 * module.exports.before = {
 *   create: [ hooks.debug('step 1') ]
 * };
 */
module.exports.debug = function (msg) {
  return function (hook) {
    console.log('* ' + (msg || '') + '\ntype:' + hook.type + ', method: ' + hook.method);
    if (hook.data) {
      console.log('data:', hook.data);
    }
    if (hook.params && hook.params.query) {
      console.log('query:', hook.params.query);
    }
    if (hook.result) {
      console.log('result:', hook.result);
    }
  };
};

/**
 * Factory for Feathers hooks.restrictToRoles.
 *
 * @param {?array|string} [defaultRoles=[]] - Roles authorized to continue. Default [].
 * @param {?string} rolesFieldName - Name of field containing roles. Default 'roles'.
 * @param {?boolean} defaultIfOwner - If record owner authorized to continue. Default false.
 * @param {?string} ownerFieldName - Name of field containing owner ID. Default 'ownerId'.
 * @returns {Function} hook function(hook, next)
 *
 * Example:
 * const authorizer = hooks.restrictToRoles([], 'allowedRoles', false, 'ownerId');
 * module.exports.before = {
 *   all: [ authorizer(['purchasing', 'accounting']) ]
 * }
 */
module.exports.restrictToRoles = function (defaultRoles) {
  var rolesFieldName = arguments.length <= 1 || arguments[1] === undefined ? 'roles' : arguments[1];
  var defaultIfOwner = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var ownerFieldName = arguments.length <= 3 || arguments[3] === undefined ? 'ownerId' : arguments[3];

  if (!defaultRoles) {
    defaultRoles = [];
  }

  return function (roles, ifOwner) {
    return authHooks.restrictToRoles({
      roles: roles || defaultRoles,
      fieldName: rolesFieldName || 'roles',
      owner: typeof ifOwner === 'undefined' ? defaultIfOwner : ifOwner,
      ownerField: ownerFieldName || 'createdById'
    });
  };
};

/**
 * Call a validation routine which returns form errors.
 *
 * @param {Function} validator - with signature (formValues, ...rest)
 * @param {?Array.<*>} rest - Params #2+ for validator
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest)
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   returns:     { email: 'Email not found', password: 'Password is incorrect.' }
 */
module.exports.validateSync = function (validator) {
  for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    rest[_key3 - 1] = arguments[_key3];
  }

  return function (hook) {
    utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateSync');

    var formErrors = validator.apply(undefined, [utils.get(hook)].concat(rest));

    if (formErrors && Object.keys(formErrors).length) {
      throw new errors.BadRequest({ errors: formErrors });
    }

    return hook;
  };
};

/**
 * Call a validation routine which uses a callback.
 *
 * @param {Function} validator - with signature (formValues, ...rest, (err, newValues) => {...})
 * @param {?Array.<*>} rest - params #2+ for validator, not including the callback
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest, internal_callback)
 *   ...rest:     All params must be specified so the callback is defined in the proper place.
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   err:         { email: 'Email not found', password: 'Password is incorrect.' } or new Error(...)
 *   newValues:   Replaces formValues if truthy
 *
 * Note this is not compatible with Feathersjs callbacks from services. Use promises for these.
 */
module.exports.validateUsingCallback = function (validator) {
  for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    rest[_key4 - 1] = arguments[_key4];
  }

  return function (hook, next) {
    utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingCallback');
    var rest1 = rest.concat(cb);

    validator.apply(undefined, [utils.get(hook)].concat(_toConsumableArray(rest1)));

    function cb(formErrors, convertedValues) {
      if (formErrors) {
        return next(formErrors instanceof Error ? formErrors : { errors: formErrors });
      }

      if (convertedValues) {
        utils.setAll(hook, convertedValues);
      }

      return next(null, hook);
    }
  };
};

/**
 * Call a validation routine which returns a Promise.
 *
 * @param {Function} validator - with signature (formValues, ...rest)
 * @param {?Array.<*>} rest - params #2+ for validator
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest)
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   reject:      reject(new errors.BadRequest({ errors: { email: 'Email not found' }}))
 *                Or reject(new errors.GeneralError(...))
 *   resolve:     resolve(data) replaces formValues if truthy
 */
module.exports.validateUsingPromise = function (validator) {
  for (var _len5 = arguments.length, rest = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    rest[_key5 - 1] = arguments[_key5];
  }

  return function (hook) {
    utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingPromise');

    return validator.apply(undefined, [utils.get(hook)].concat(rest)).then(function (convertedValues) {
      if (convertedValues) {
        utils.setAll(hook, convertedValues);
      }

      return hook;
    });
  };
};

/**
 * Before acting on a request, such as saving a new user record. the server should validate the
 * schema of the request object, rerun any validations the client has already performed,
 * and then perform any additional server-side validation.
 *
 * We would of course prefer to reuse the client-side validation code.
 *
 * The following would be typical validation for user create if we use
 * - the popular redux-form for handling react client forms
 * - joi for schema validation:
 *
 * // index.js
 * // support async checking for unique email addrs and usernames, among other things
 * const verifyResetService = require('feathers-service-verify-reset').service;
 * app.configure(verifyResetService(...)); // custom service
 *
 * // user/hooks/index.js
 * const hooks = require('feathers-hooks-common');
 * const validateSchema = require('feathers-hooks-validate-joi');
 * const verifyReset = app.service('/verifyReset/:action/:value');
 *
 * create: [
 *   validateSchema.form(schemas.signup, schemas.options), // schema validation
 *   hooks.validateSync(usersClientValidations.signup),  // redo redux-form client validation
 *   hooks.validateUsingPromise( // redo redux-form async validation, for uniqueness
 *     (values) => verifyReset.create( // wrap call for compatibility with validateUsingPromise
 *       { action: 'unique', value: { username: values.username, email: values.email } }
 *     )
 *   ),
 *   hooks.validateUsingCallback(usersServerValidations.signup, {}), // server validation
 *   hooks.remove('confirmPassword'),
 *   auth.hashPassword(),
 * ],
 *
 * See feathersjs-starter-react-redux-login for a working example.
 */