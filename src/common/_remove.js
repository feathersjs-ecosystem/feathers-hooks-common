
import deleteByDot from './delete-by-dot';
import _transformItems from './_transform-items';

export default function (items /* modified */, fieldNames) {
  _transformItems(items, fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      deleteByDot(item, fieldName);
    }
  });
}
