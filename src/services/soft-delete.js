
import feathersErrors from 'feathers-errors';
import checkContext from './check-context';

const errors = feathersErrors.errors;

export default function (field) {
  const deleteField = field || 'deleted';

  return function (hook) {
    const service = this;
    hook.data = hook.data || {};
    hook.params.query = hook.params.query || {};
    checkContext(hook, 'before', null, 'softDelete');

    if (hook.params.query.$disableSoftDelete) {
      delete hook.params.query.$disableSoftDelete;
      return hook;
    }
    switch (hook.method) {
      case 'find':
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'get':
        return throwIfItemDeleted(hook.id)
          .then((data) => {
            // We got data by calling the same 'service.get' with the
            // $disableSoftDelete parameter which should not be used
            // by service methods or other hooks,
            // so there is no need to call 'service.get' twice.
            hook.result = data;
            return hook;
          });
      case 'create':
        return hook;
      case 'update': // fall through
      case 'patch':
        if (hook.id) {
          return throwIfItemDeleted(hook.id)
            .then(() => hook);
        }
        hook.params.query[deleteField] = { $ne: true };
        return hook;
      case 'remove':
        return Promise.resolve()
          .then(() => hook.id ? throwIfItemDeleted(hook.id) : null)
          .then(() => {
            hook.data[deleteField] = true;
            hook.params.query[deleteField] = { $ne: true };
            hook.params.query.$disableSoftDelete = true;

            return service.patch(hook.id, hook.data, hook.params)
              .then(result => {
                hook.result = result;
                return hook;
              });
          });
    }

    function throwIfItemDeleted (id) {
      return service.get(id, { query: { $disableSoftDelete: true } })
        .then(data => {
          if (data[deleteField]) {
            throw new errors.NotFound('Item has been soft deleted.');
          }
          return data;
        })
        .catch(() => {
          throw new errors.NotFound('Item not found.');
        });
    }
  };
}
