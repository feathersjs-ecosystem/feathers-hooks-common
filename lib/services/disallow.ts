
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (...providers: any[]) {
  return (context: any) => {
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
