import _set from 'lodash/set.js';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Fix slugs in URL, e.g. /stores/:storeId.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setslug
 */
export const setSlug =
  <H extends HookContext = HookContext>(slug: string, fieldName?: string) =>
  (context: H) => {
    if (typeof fieldName !== 'string') {
      fieldName = `query.${slug}`;
    }

    if (context.params && context.params.provider === 'rest') {
      const value = context.params.route[slug];
      if (typeof value === 'string' && value[0] !== ':') {
        _set(context.params, fieldName, value);
      }
    }
  };
