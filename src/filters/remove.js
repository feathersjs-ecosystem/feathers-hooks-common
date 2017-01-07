
import _remove from '../common/_remove';

export default function (...fields) {
  return data => {
    _remove(data, fields);
    return data;
  };
}
