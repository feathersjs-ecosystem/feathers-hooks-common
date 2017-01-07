
import setByDot from './set-by-dot';
import _transformItems from './_transform-items';

export default function (items /* modified */, fieldNames) {
  _transformItems(items, fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      setByDot(item, fieldName, undefined, true);
    }
  });
}
