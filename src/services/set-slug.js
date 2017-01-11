
import feathersErrors from 'feathers-errors';

import setByDot from '../common/set-by-dot';

const errors = feathersErrors.errors;

export default function (slug, field) {
  return hook => {
    if (typeof field !== 'string') {
      field = `query.${slug}`;
    }

    if (hook.type === 'after') {
      throw new errors.GeneralError('Cannot set slug on after hook. (setSlug)');
    }

    if (hook.params && hook.params.provider === 'rest') {
      const value = hook.params[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        setByDot(hook.params, field, value);
      }
    }
  };
}
