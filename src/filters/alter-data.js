
import { _remove, _pluck, _traverse, _setFields } from '../common/alter-data';

export const remove = (...fields) => data => _remove(data, fields);

export const pluck = (...fields) => data => _pluck(data, fields);

export const traverse = (converter, getObj) => (data, connection, hook) => {
  if (typeof getObj === 'function') {
    var items = getObj(data, connection, hook);
  } else {
    items = getObj || data;
  }

  _traverse(items, converter);
};

export const setFilteredAt = (...fieldNames) => data => {
  if (!fieldNames.length) {
    fieldNames = ['filteredAt'];
  }

  _setFields(data, () => new Date(), fieldNames);

  return data;
};

export default Object.assign(
  remove,
  pluck,
  traverse,
  setFilteredAt,
);
