
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (...providers: any[]) {
  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return (context: any) => {
    const hookProvider = (context.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && !!hookProvider)
    );
  };
};
