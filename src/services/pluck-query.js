
import _pluck from '../common/_pluck';
import checkContext from './check-context';

export default function (...fieldNames) {
  return hook => {
    checkContext(hook, 'before', null, 'pluckQuery');

    const query = (hook.params || {}).query || {};
    hook.params.query = _pluck(query, fieldNames);

    return hook;
  };
}
