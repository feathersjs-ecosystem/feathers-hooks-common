import errors from '@feathersjs/errors';
const { BadRequest } = errors;
import type { Hook } from '@feathersjs/feathers';
import { setFields as _setFields } from '../common';
import { getItems } from '../utils/get-items';

/**
 * Create/update certain fields to the current date-time.
 * {@link https://hooks-common.feathersjs.com/hooks.html#setnow}
 */
export function setNow (...fieldNames: string[]): Hook {
  if (!fieldNames.length) {
    throw new BadRequest('Field name is required. (setNow)');
  }

  return (context: any) => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'setNow');
    return context;
  };
}
