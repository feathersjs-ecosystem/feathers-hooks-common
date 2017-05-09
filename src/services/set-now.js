
import errors from 'feathers-errors';

import _setFields from '../common/_set-fields';
import getItems from './get-items';

export default function (...fieldNames) {
  if (!fieldNames.length) {
    throw new errors.BadRequest('Field name is required. (setNow)');
  }

  return hook => {
    _setFields(getItems(hook), () => new Date(), fieldNames, 'setNow');
    return hook;
  };
}
