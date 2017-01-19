
// Is compatible with softDelete

import checkContext from './check-context';

export default function (slugName) {
  return function (hook) {
    checkContext(hook, 'before', ['patch', 'remove'], 'modifyWithSlug');
    if (hook.id !== null) {
      const idField = hook.service.id;
      const query = {
        $or: [{
          [idField]: hook.id
        }, {
          [slugName]: hook.id
        }]
      };

      hook.id = null;
      hook.params.query = query;
    }

    return hook;
  };
}
