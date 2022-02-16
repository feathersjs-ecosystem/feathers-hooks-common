// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (slug: any, field: any) {
  return (context: any) => {
    if (typeof field !== 'string') {
      field = `query.${slug}`;
    }

    if (context.type === 'after') {
      throw new errors.GeneralError('Cannot set slug on after hook. (setSlug)');
    }

    if (context.params && context.params.provider === 'rest') {
      const value = context.params.route[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        setByDot(context.params, field, value);
      }
    }
  };
};
