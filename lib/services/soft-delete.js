
const feathersErrors = require('@feathersjs/errors');
const checkContext = require('./check-context');

const errors = feathersErrors.errors;

module.exports = function (field) {
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
        return throwIfItemDeleted(hook.id, true)
          .then(data => {
            hook.result = data;
            return hook;
          });
      case 'create':
        return hook;
      case 'update': // fall through
      case 'patch':
        if (hook.id !== null) {
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

    function throwIfItemDeleted (id, isGet) {
      const params = isGet ? hook.params : {
        query: {},
        provider: hook.params.provider,
        _populate: 'skip',
        authenticated: hook.params.authenticated,
        user: hook.params.user
      };

      params.query.$disableSoftDelete = true;

      return service.get(id, params)
        .then(data => {
          delete params.query.$disableSoftDelete;

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
};
