
import _pluck from '../common/_pluck';

export default function (...fields) {
  return data => _pluck(data, fields);
}
