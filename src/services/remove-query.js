
import _remove from '../common/_remove';
import checkContext from './check-context';

export default function (...fieldNames) {
  return hook => {
    checkContext(hook, 'before', null, 'removeQuery');

    const query = (hook.params || {}).query || {};
    _remove(query, fieldNames);

    return hook;
  };
}
