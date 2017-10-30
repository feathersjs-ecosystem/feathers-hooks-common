
const feathersErrors = require('feathers-errors');

const errors = feathersErrors.errors;

module.exports = function (...providers) {
  return hook => {
    const hookProvider = (hook.params || {}).provider;

    const anyProvider = providers.length === 0;
    const thisProvider = providers.some(provider =>
      provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );

    if (anyProvider || thisProvider) {
      throw new errors.MethodNotAllowed(
        `Provider '${hook.params.provider}' can not call '${hook.method}'. (disableMethod)`
      );
    }
  };
};
