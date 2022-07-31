import _set from 'lodash/set.js';
import errors from '@feathersjs/errors';
const { GeneralError } = errors;
import type { Hook } from '@feathersjs/feathers';

/**
 * Fix slugs in URL, e.g. /stores/:storeId.
 * {@link https://hooks-common.feathersjs.com/hooks.html#setslug}
 */
export function setSlug (slug: string, fieldName?: string): Hook {
  return (context: any) => {
    if (typeof fieldName !== 'string') {
      fieldName = `query.${slug}`;
    }

    if (context.type === 'after') {
      throw new GeneralError('Cannot set slug on after hook. (setSlug)');
    }

    if (context.params && context.params.provider === 'rest') {
      const value = context.params.route[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        _set(context.params, fieldName, value);
      }
    }
  };
}
