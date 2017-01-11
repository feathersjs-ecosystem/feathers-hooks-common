
import _pluck from '../common/_pluck';
import checkContextIf from './check-context-if';
import getItems from './get-items';
import replaceItems from './replace-items';

export default function (...fieldNames) {
  return hook => {
    checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'pluck');

    if (hook.params.provider) {
      replaceItems(hook, _pluck(getItems(hook), fieldNames));
    }

    return hook;
  };
}
