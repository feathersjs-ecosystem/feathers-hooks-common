import { BadRequest } from '@feathersjs/errors';
import { Hook } from '@feathersjs/feathers';
import _setFields from '../common/_set-fields';
import {getItems} from './get-items';

/**
 * Create/update certain fields to the current date-time.
 * {@link https://hooks-common.feathersjs.com/hooks.html#SetNow}
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
