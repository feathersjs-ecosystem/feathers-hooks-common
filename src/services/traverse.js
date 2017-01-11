
import _traverse from '../common/_traverse';
import getItems from './get-items';

export default function (converter, getObj) {
  return hook => {
    const items = typeof getObj === 'function' ? getObj(hook) : getObj || getItems(hook);

    _traverse(items, converter);
    return hook;
  };
}
