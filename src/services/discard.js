
import _remove from '../common/_remove';
import checkContextIf from './check-context-if';
import getItems from './get-items';

export default function (...fieldNames) {
  return hook => {
    checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'discard');

    _remove(getItems(hook), fieldNames);

    return hook;
  };
}
