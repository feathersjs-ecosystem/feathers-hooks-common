
import _traverse from '../common/_traverse';

export default function (converter, getObj) {
  return (data, connection, hook) => {
    const items = typeof getObj === 'function' ? getObj(data, connection, hook) : getObj || data;

    _traverse(items, converter);
  };
}
