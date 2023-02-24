import _set from 'lodash/set.js';
import { GeneralError } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Fix slugs in URL, e.g. /stores/:storeId.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setslug
 */
export function setSlug<H extends HookContext = HookContext>(slug: string, fieldName?: string) {
  return (context: H) => {
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
