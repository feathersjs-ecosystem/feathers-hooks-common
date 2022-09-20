import { BadRequest } from '@feathersjs/errors';
import { setFields as _setFields } from '../common';
import type { HookFunction } from '../types';
import { getItems } from '../utils/get-items';

/**
 * Create/update certain fields to the current date-time.
 * {@link https://hooks-common.feathersjs.com/hooks.html#setnow}
 */
export function setNow (...fieldNames: string[]): HookFunction {
  if (!fieldNames.length) {
    throw new BadRequest('Field name is required. (setNow)');
  }

  return (context: any) => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'setNow');
    return context;
  };
}
