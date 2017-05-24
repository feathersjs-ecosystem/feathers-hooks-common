
import _pluck from '../common/_pluck';
import checkContextIf from './check-context-if';
import getItems from './get-items';
import replaceItems from './replace-items';

export default function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'pluck');

    if (context.params.provider) {
      replaceItems(context, _pluck(getItems(context), fieldNames));
    }

    return context;
  };
}
