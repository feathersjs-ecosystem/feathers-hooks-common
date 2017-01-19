
import errors from 'feathers-errors';
import checkContext from './check-context';

export default function () {
  return function (hook) {
    checkContext(hook, 'before', ['update', 'patch', 'remove'], 'disableMultiItemChange');

    if (hook.id === null) {
      throw new errors.BadRequest(
        `Multi-record changes not allowed for ${hook.path} ${hook.method}. (disableMultiItemChange)`
      );
    }
  };
}
