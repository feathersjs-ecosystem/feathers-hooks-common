import { BadRequest } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';
import { setFields } from '../../common';
import { getItems } from '../../utils';

/**
 * Create/update certain fields to the current date-time.
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#setnow
 *
 * @deprecated Use `setNowData` or `setNowResult` instead.
 */
export function setNow<H extends HookContext = HookContext>(...fieldNames: string[]) {
  if (!fieldNames.length) {
    throw new BadRequest('Field name is required. (setNow)');
  }

  return (context: H) => {
    setFields(getItems(context), () => new Date(), fieldNames, 'setNow');
    return context;
  };
}
