
import feathersErrors from 'feathers-errors';
import checkContext from './check-context';

const errors = feathersErrors.errors;

export default function (field) {
  const deleteField = field || 'deleted';

  return function (hook) {
    const service = hook.service;
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
      // It is important to pass all params, among which are:
      // * 'provider' - is needed for succeeding hooks like 'restrictToRoles'.
      // * 'authenticated' - flag, set by preceding 'authenticate' hook,
      //    is required to skip 'authenticate', that will be called otherwise,
      //    because the 'provider' is passed.
      // * original query, that is required to treat the result of this
      //    internall call as a final result.
      hook.params.query.$disableSoftDelete = true;
      return service.get(id, hook.params)
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
