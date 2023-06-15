import _get from 'lodash/get.js';
import _setWith from 'lodash/setWith.js';
import _clone from 'lodash/clone.js';
import _debug from 'debug';
import { checkContext } from '../utils/check-context';
import { Forbidden } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

export interface SetFieldOptions {
  as: string;
  from: string;
  allowUndefined?: boolean;
}

const debug = _debug('feathers-hooks-common/setField');

/**
 * The `setField` hook allows to set a field on the hook context based on the value of another field on the hook context.
 * @see https://hooks-common.feathersjs.com/hooks.html#setfield
 */
export function setField<H extends HookContext = HookContext>({
  as,
  from,
  allowUndefined = false,
}: SetFieldOptions) {
  if (!as || !from) {
    throw new Error("'as' and 'from' options have to be set");
  }

  return (context: H) => {
    const { params } = context;

    checkContext(context, 'before', null, 'setField');

    const value = _get(context, from);

    if (value === undefined) {
      if (!params.provider || allowUndefined) {
        debug(`Skipping call with value ${from} not set`);
        return context;
      }

      throw new Forbidden(`Expected field ${as} not available`);
    }

    debug(`Setting value '${value}' from '${from}' as '${as}'`);

    return _setWith(context, as, value, _clone);
  };
}
