
import feathersErrors from 'feathers-errors';
import { getItems, replaceItems, setByDot, checkContextIf } from './utils';
import { _transformItems, _remove, _pluck, _traverse, _setFields } from '../common/alter-data';

const errors = feathersErrors.errors;

export const remove = (...fieldNames) => hook => {
  checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'remove');

  if (hook.params.provider) {
    _remove(getItems(hook), fieldNames);
  }

  return hook;
};

export const pluck = (...fieldNames) => hook => {
  checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'pluck');

  if (hook.params.provider) {
    replaceItems(hook, _pluck(getItems(hook), fieldNames));
  }

  return hook;
};

export const lowerCase = (...fieldNames) => hook => {
  checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'lowercase');

  _transformItems(getItems(hook), fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      if (typeof value !== 'string' && value !== null) {
        throw new errors.BadRequest(`Expected string data. (lowercase ${fieldName})`);
      }

      setByDot(item, fieldName, value ? value.toLowerCase() : value);
    }
  });

  return hook;
};

export const setCreatedAt = (...fieldNames) => hook => {
  _setFields(getItems(hook), () => new Date(), fieldNames, 'createdAt');
  return hook;
};

export const setUpdatedAt = (...fieldNames) => hook => {
  _setFields(getItems(hook), () => new Date(), fieldNames, 'updatedAt');
  return hook;
};

export const traverse = (converter, getObj) => hook => {
  const items = typeof getObj === 'function' ? getObj(hook) : getObj || getItems(hook);

  _traverse(items, converter);
  return hook;
};
