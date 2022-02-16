
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');

const stndAuthProps = ['provider', 'authenticated', 'user']; // feathers-authentication
// App wide defaults
const defaults = {
  propNames: stndAuthProps,
  newProps: {}
};

// Set app wide defaults
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callingPar... Remove this comment to see the full error message
function callingParamsDefaults (defaultPropNames = [], defaultNewProps = undefined) {
  if (defaultPropNames) {
    defaults.propNames = Array.isArray(defaultPropNames) ? defaultPropNames : [defaultPropNames];
  }

  if (defaultNewProps) {
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'undefined' is not assignable to type '{}'.
    defaults.newProps = defaultNewProps;
  }
}

// Utility func for explicit use in hook parameters `callingParams(...)`.
// It defaults to `callingParams()`.
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callingPar... Remove this comment to see the full error message
function callingParams ({
  query,
  propNames = [],
  newProps = {},
  hooksToDisable = [],
  ignoreDefaults
}: any = {}) {
  return (context: any) => {
    propNames = Array.isArray(propNames) ? propNames : [propNames];
    hooksToDisable = Array.isArray(hooksToDisable) ? hooksToDisable : [hooksToDisable];

    const newParams = query ? { query } : {};
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    const allPropNames = ignoreDefaults ? propNames : [].concat(defaults.propNames, propNames);

    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'name' implicitly has an 'any' type.
    allPropNames.forEach(name => {
      if (name) { // for makeCallingParams compatibility
        const value = getByDot(context.params, name);

        if (value !== undefined) {
          setByDot(newParams, name, value);
        }
      }
    });

    Object.assign(newParams, ignoreDefaults ? {} : defaults.newProps, newProps);

    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'name' implicitly has an 'any' type.
    hooksToDisable.forEach(name => {
      switch (name) {
        case 'populate': // fall through
        case 'fastJoin':
          // @ts-expect-error ts-migrate(2339) FIXME: Property '_populate' does not exist on type '{ que... Remove this comment to see the full error message
          newParams._populate = 'skip';
          break;
        case 'softDelete':
          newParams.query = newParams.query || {};
          newParams.query.$disableSoftDelete = true;
          break;
        case 'softDelete2':
          // @ts-expect-error ts-migrate(2339) FIXME: Property '$disableSoftDelete2' does not exist on t... Remove this comment to see the full error message
          newParams.$disableSoftDelete2 = true;
          break;
        case 'ignoreDeletedAt':
          // @ts-expect-error ts-migrate(2339) FIXME: Property '$ignoreDeletedAt' does not exist on type... Remove this comment to see the full error message
          newParams.$ignoreDeletedAt = true;
          break;
        case 'stashBefore':
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'disableStashBefore' does not exist on ty... Remove this comment to see the full error message
          newParams.disableStashBefore = true;
          break;
      }
    });

    return newParams;
  };
}

// Function compatible with previous makeCallingParams utility.
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'makeCallin... Remove this comment to see the full error message
function makeCallingParams (context: any, query: any, propNames: any, newProps = {}) {
  return callingParams({
    query,
    propNames: propNames === undefined ? ['provider', 'authenticated', 'user'] : propNames,
    newProps: Object.assign({}, { _populate: 'skip' }, newProps),
    ignoreDefaults: true
  })(context);
}

module.exports = {
  callingParamsDefaults,
  callingParams,
  makeCallingParams
};
