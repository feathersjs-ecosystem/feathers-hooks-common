'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports.validateUsingPromise = exports.validateUsingCallback = exports.validateSync = exports.restrictToRoles = exports.debug = exports.setSlug = exports.setUpdatedAt = exports.setCreatedAt = undefined;

var _feathersAuthentication = require('feathers-authentication');

var _feathersAuthentication2 = _interopRequireDefault(_feathersAuthentication);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-env es6, node */
/* eslint  max-len: 0, new-cap: 0, no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

var authHooks = _feathersAuthentication2.default.hooks;

/**
 * Set one or more fields to a value. Base function for setCreateAt and setUpdatedAt.
 *
 * @param {string} defaultFieldName - default field name to add or update
 * @param {*} value - The value to set the fields to
 * @param {Array.<string|Function>} fieldNames - Field names.
 * @returns {Function} hook function(hook).
 */
var setField = function setField(defaultFieldName, value) {
  for (var _len = arguments.length, fieldNames = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    fieldNames[_key - 2] = arguments[_key];
  }

  var addFields = function addFields(data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fieldNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        (0, _utils.setByDot)(data, field, value);
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

  var callback = typeof fieldNames[fieldNames.length - 1] === 'function' ? fieldNames.pop() : function () {
    return true;
  };

  if (!fieldNames.length) {
    fieldNames = [defaultFieldName];
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
};

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fieldNames - Field names.
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
var setCreatedAt = exports.setCreatedAt = function setCreatedAt() {
  for (var _len2 = arguments.length, fieldNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fieldNames[_key2] = arguments[_key2];
  }

  return setField.apply(undefined, ['createdAt', new Date()].concat(fieldNames));
};

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fieldNames - Field names.
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
var setUpdatedAt = exports.setUpdatedAt = function setUpdatedAt() {
  for (var _len3 = arguments.length, fieldNames = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fieldNames[_key3] = arguments[_key3];
  }

  return setField.apply(undefined, ['updatedAt', new Date()].concat(fieldNames));
};

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
var setSlug = exports.setSlug = function setSlug(slug, field) {
  return function (hook) {
    if (typeof field !== 'string') {
      field = 'query.' + slug;
    }

    if (hook.type === 'after') {
      throw new _feathersErrors2.default.GeneralError('Cannot set slug on after hook. (setSlug)');
    }

    if (hook.params && hook.params.provider === 'rest') {
      var value = hook.params[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        (0, _utils.setByDot)(hook.params, field, value);
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
var debug = exports.debug = function debug(msg) {
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
 * DEPRECATED: Factory for Feathers hooks.restrictToRoles.
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
var restrictToRoles = exports.restrictToRoles = function restrictToRoles(defaultRoles) {
  var rolesFieldName = arguments.length <= 1 || arguments[1] === undefined ? 'roles' : arguments[1];
  var defaultIfOwner = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var ownerFieldName = arguments.length <= 3 || arguments[3] === undefined ? 'ownerId' : arguments[3];

  console.error('DEPRECATED Use feathers-authentication v0.8. Removed next ver. (restrictToRoles)');
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
var validateSync = exports.validateSync = function validateSync(validator) {
  for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    rest[_key4 - 1] = arguments[_key4];
  }

  return function (hook) {
    console.error('DEPRECATED Removed next ver. (validateSync)');
    (0, _utils.checkContext)(hook, 'before', ['create', 'update', 'patch'], 'validateSync');

    var formErrors = validator.apply(undefined, [(0, _utils.getItems)(hook)].concat(rest));

    if (formErrors && Object.keys(formErrors).length) {
      throw new _feathersErrors2.default.BadRequest({ errors: formErrors });
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
var validateUsingCallback = exports.validateUsingCallback = function validateUsingCallback(validator) {
  for (var _len5 = arguments.length, rest = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    rest[_key5 - 1] = arguments[_key5];
  }

  return function (hook, next) {
    console.error('DEPRECATED Removed next ver. (validateUsingCallback)');
    (0, _utils.checkContext)(hook, 'before', ['create', 'update', 'patch'], 'validateUsingCallback');
    var rest1 = rest.concat(cb);

    validator.apply(undefined, [(0, _utils.getItems)(hook)].concat(_toConsumableArray(rest1)));

    function cb(formErrors, convertedValues) {
      if (formErrors) {
        return next(formErrors instanceof Error ? formErrors : new _feathersErrors2.default.BadRequest('Invalid data', { errors: formErrors }), hook);
      }

      if (convertedValues) {
        (0, _utils.replaceItems)(hook, convertedValues);
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
var validateUsingPromise = exports.validateUsingPromise = function validateUsingPromise(validator) {
  for (var _len6 = arguments.length, rest = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    rest[_key6 - 1] = arguments[_key6];
  }

  console.error('DEPRECATED Removed next ver. (validateUsingPromise)');

  return validate.apply(undefined, [validator].concat(rest));
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
var validate = exports.validate = function validate(validator) {
  for (var _len7 = arguments.length, rest = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    rest[_key7 - 1] = arguments[_key7];
  }

  return function (hook) {
    console.error('DEPRECATED Removed next ver. (validateUsingPromise)');
    (0, _utils.checkContext)(hook, 'before', ['create', 'update', 'patch'], 'validateUsingPromise');

    return validator.apply(undefined, [(0, _utils.getItems)(hook)].concat(rest)).then(function (convertedValues) {
      if (convertedValues) {
        (0, _utils.replaceItems)(hook, convertedValues);
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