
const feathersErrors = require('feathers-errors');

const errors = feathersErrors.errors;

module.exports = function (...providers) {
  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return hook => {
    const hookProvider = (hook.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && hookProvider)
    );
  };
};
