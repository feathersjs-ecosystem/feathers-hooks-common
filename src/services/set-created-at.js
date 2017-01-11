
import _setFields from '../common/_set-fields';
import getItems from './get-items';

export default function (...fieldNames) {
  return hook => {
    _setFields(getItems(hook), () => new Date(), fieldNames, 'createdAt');
    return hook;
  };
}
