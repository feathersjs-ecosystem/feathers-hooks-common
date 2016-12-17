
import { getItems, replaceItems, checkContext } from '../utils';
import { _remove, _pluck, _traverse } from '../common/alter-data';

export const remove = (...fields) => hook => {
  if (hook.type === 'before') {
    checkContext(hook, 'before', ['create', 'update', 'patch'], 'remove');
  }

  if (!hook.params.provider) {
    return hook;
  }

  replaceItems(hook, _remove(getItems(hook), fields));

  return hook;
};

export const pluck = (...fields) => hook => {
  if (hook.type === 'before') {
    checkContext(hook, 'before', ['create', 'update', 'patch'], 'pluck');
  }

  if (!hook.params.provider) {
    return hook;
  }

  replaceItems(hook, _pluck(getItems(hook), fields));

  return hook;
};

export const traverse = (converter, getObj) => hook => {
  if (typeof getObj === 'function') {
    var items = getObj(hook);
  } else {
    items = getObj || getItems(hook);
  }

  _traverse(items, converter);

  return hook;
};

export default Object.assign(
  remove,
  pluck,
  traverse,
);
