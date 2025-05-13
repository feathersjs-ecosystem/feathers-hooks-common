import type { HookContext } from '@feathersjs/feathers';
import _omit from 'lodash/omit.js';
import { MaybeArray, toArray } from '../../internal.utils';

/**
 * Delete certain fields from the query object.
 * @see https://hooks-common.feathersjs.com/hooks.html#discardquery
 */
export const omitQuery =
  <H extends HookContext = HookContext>(fieldNames: MaybeArray<string>) =>
  (context: H) => {
    if (!context.params.query) {
      return context;
    }

    context.params.query = _omit(context.params.query, toArray(fieldNames));

    return context;
  };
