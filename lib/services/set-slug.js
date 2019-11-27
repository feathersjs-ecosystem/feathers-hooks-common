const setByDot = require('lodash/set');
const errors = require('@feathersjs/errors');

module.exports = function (slug, field) {
  return context => {
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
