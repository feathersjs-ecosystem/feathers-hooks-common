
import feathersErrors from 'feathers-errors';

import _transformItems from '../common/_transform-items';
import checkContextIf from './check-context-if';
import getItems from './get-items';
import setByDot from '../common/set-by-dot';

const errors = feathersErrors.errors;

export default function (...fieldNames) {
  return hook => {
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
}
