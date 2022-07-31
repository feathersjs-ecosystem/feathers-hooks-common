import _get from 'lodash/get.js';
import _setWith from 'lodash/setWith.js';
import _clone from 'lodash/clone.js';
import _debug from 'debug';
import { checkContext } from '../utils/check-context';
import errors from '@feathersjs/errors';
const { Forbidden } = errors;
import type { Hook } from '@feathersjs/feathers';
import type { SetFieldOptions } from '../types';

const debug = _debug('feathers-hooks-common/setField');

/**
 * The `setField` hook allows to set a field on the hook context based on the value of another field on the hook context.
 * {@link https://hooks-common.feathersjs.com/hooks.html#setfield}
 */
export function setField (
  { as, from, allowUndefined = false }: SetFieldOptions
): Hook {
  if (!as || !from) {
    throw new Error('\'as\' and \'from\' options have to be set');
  }

  return context => {
    const { params, app } = context;

    if (app.version < '4.0.0') {
      throw new Error('The \'setField\' hook only works with Feathers 4 and the latest database adapters');
    }

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
