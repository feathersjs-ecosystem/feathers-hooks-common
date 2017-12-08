
const errors = require('@feathersjs/errors');

module.exports = function (realm, ...args) {
  console.log('DEPRECATED. Use disallow instead. (disable)');

  if (!realm) {
    return context => {
      throw new errors.MethodNotAllowed(`Calling '${context.method}' not allowed. (disable)`);
    };
  }

  if (typeof realm === 'function') {
    return context => {
      const result = realm(context);
      const update = check => {
        if (!check) {
          throw new errors.MethodNotAllowed(`Calling '${context.method}' not allowed. (disable)`);
        }
      };

      if (result && typeof result.then === 'function') {
        return result.then(update);
      }

      update(result);
    };
  }

  const providers = [realm].concat(args);

  return context => {
    const provider = context.params.provider;

    if ((realm === 'external' && provider) || providers.indexOf(provider) !== -1) {
      throw new errors.MethodNotAllowed(
        `Provider '${context.params.provider}' can not call '${context.method}'. (disable)'`
      );
    }
  };
};
