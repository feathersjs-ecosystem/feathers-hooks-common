
const errors = require('@feathersjs/errors');

module.exports = function (...providers) {
  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return context => {
    const hookProvider = (context.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );
  };
};
