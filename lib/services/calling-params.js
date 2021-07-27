
const getByDot = require('lodash/get');
const setByDot = require('lodash/set');

const stndAuthProps = ['provider', 'authenticated', 'user']; // feathers-authentication
// App wide defaults
const defaults = {
  propNames: stndAuthProps,
  newProps: {}
};

// Set app wide defaults
function callingParamsDefaults (defaultPropNames = [], defaultNewProps = undefined) {
  if (defaultPropNames) {
    defaults.propNames = Array.isArray(defaultPropNames) ? defaultPropNames : [defaultPropNames];
  }

  if (defaultNewProps) {
    defaults.newProps = defaultNewProps;
  }
}

// Utility func for explicit use in hook parameters `callingParams(...)`.
// It defaults to `callingParams()`.
function callingParams ({ query, propNames = [], newProps = {}, hooksToDisable = [], ignoreDefaults } = {}) {
  return context => {
    propNames = Array.isArray(propNames) ? propNames : [propNames];
    hooksToDisable = Array.isArray(hooksToDisable) ? hooksToDisable : [hooksToDisable];

    const newParams = query ? { query } : {};
    const allPropNames = ignoreDefaults ? propNames : [].concat(defaults.propNames, propNames);

    allPropNames.forEach(name => {
      if (name) { // for makeCallingParams compatibility
        const value = getByDot(context.params, name);

        if (value !== undefined) {
          setByDot(newParams, name, value);
        }
      }
    });

    Object.assign(newParams, ignoreDefaults ? {} : defaults.newProps, newProps);

    hooksToDisable.forEach(name => {
      switch (name) {
        case 'populate': // fall through
        case 'fastJoin':
          newParams._populate = 'skip';
          break;
        case 'softDelete':
          newParams.query = newParams.query || {};
          newParams.query.$disableSoftDelete = true;
          break;
        case 'softDelete2':
          newParams.$disableSoftDelete2 = true;
          break;
        case 'ignoreDeletedAt':
          newParams.$ignoreDeletedAt = true;
          break;
        case 'stashBefore':
          newParams.disableStashBefore = true;
          break;
      }
    });

    return newParams;
  };
}

// Function compatible with previous makeCallingParams utility.
function makeCallingParams (context, query, propNames, newProps = {}) {
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
