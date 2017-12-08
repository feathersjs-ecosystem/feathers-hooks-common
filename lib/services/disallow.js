
const errors = require('@feathersjs/errors');

module.exports = function (...providers) {
  return context => {
    const hookProvider = (context.params || {}).provider;

    const anyProvider = providers.length === 0;
    const thisProvider = providers.some(provider =>
      provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );

    if (anyProvider || thisProvider) {
      throw new errors.MethodNotAllowed(
        `Provider '${context.params.provider}' can not call '${context.method}'. (disallow)`
      );
    }
  };
};
