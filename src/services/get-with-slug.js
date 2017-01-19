
// Is not compatible with softDelete

import checkContext from './check-context';

export default function (slugName) {
  return function (hook) {
    checkContext(hook, 'before', ['get'], 'getWithSlug');

    const idField = hook.service.id;
    const query = {
      $or: [{
        [idField]: hook.id
      }, {
        [slugName]: hook.id
      }]
    };

    return hook.service.find({
      query,
      paginate: false
    }).then(result => {
      if (result.length === 1) {
        hook.result = result[0];
      }

      return hook;
    });
  };
}
