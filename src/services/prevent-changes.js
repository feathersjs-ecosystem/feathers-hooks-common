
import existsByDot from '../common/exists-by-dot';
import checkContext from './check-context';
import errors from 'feathers-errors';

export default function (...fieldNames) {
  return hook => {
    checkContext(hook, 'before', ['patch'], 'preventChanges');
    const data = hook.data;

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        throw new errors.BadRequest(`${name} may not be patched. (preventChanges)`);
      }
    });
  };
}
