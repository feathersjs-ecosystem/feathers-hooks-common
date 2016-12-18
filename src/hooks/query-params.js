
import { checkContext } from './utils';
import { _remove, _pluck } from '../common/alter-data';


export const removeQuery = (...fieldNames) => hook => {
  checkContext(hook, 'before', null, 'removeQuery');
  
  const query = (hook.params || {}).query || {};
  _remove(query, fieldNames);
  
  return hook;
};

export const pluckQuery = (...fieldNames) => hook => {
  checkContext(hook, 'before', null, 'pluckQuery');
  
  const query = (hook.params || {}).query || {};
  hook.params.query = _pluck(query, fieldNames);
  
  return hook;
};
