
import { _remove, _pluck, _traverse, _setFields } from '../common/alter-data';

export const remove = (...fields) => data => {
  _remove(data, fields);
  return data;
};

export const pluck = (...fields) => data => _pluck(data, fields);

export const traverse = (converter, getObj) => (data, connection, hook) => {
  const items = typeof getObj === 'function' ? getObj(data, connection, hook) : getObj || data;
  
  _traverse(items, converter);
};

export const setFilteredAt = (...fieldNames) => data => {
  _setFields(data, () => new Date(), fieldNames, 'filteredAt');
  return data;
};
