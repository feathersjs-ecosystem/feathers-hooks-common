
import _setFields from '../common/_set-fields';

export default function (...fieldNames) {
  return data => {
    _setFields(data, () => new Date(), fieldNames, 'filteredAt');
    return data;
  };
}
