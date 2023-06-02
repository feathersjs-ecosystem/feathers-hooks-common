import { BadRequest } from '@feathersjs/errors';
import type { HookContext, NextFunction } from '@feathersjs/feathers';
import { setFields as _setFields } from '../common';
import { getItems } from '../utils/get-items';

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 */
export function setNow<H extends HookContext = HookContext>(...fieldNames: string[]) {
  if (!fieldNames.length) {
    throw new BadRequest('Field name is required. (setNow)');
  }

  return (context: H, next?: NextFunction) => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'setNow');

    if (next) {
      return next();
    }

    return context;
  };
}
