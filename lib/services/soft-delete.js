
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');

module.exports = function (field) {
  const deleteField = field || 'deleted';

  return function (context) {
    const service = context.service;
    context.data = context.data || {};
    context.params.query = context.params.query || {};
    checkContext(context, 'before', null, 'softDelete');

    if (context.params.query.$disableSoftDelete) {
      delete context.params.query.$disableSoftDelete;
      return context;
    }

    switch (context.method) {
      case 'find':
        context.params.query[deleteField] = { $ne: true };
        return context;
      case 'get':
        return throwIfItemDeleted(context.id, true)
          .then(data => {
            context.result = data;
            return context;
          });
      case 'create':
        return context;
      case 'update': // fall through
      case 'patch':
        if (context.id !== null) {
          return throwIfItemDeleted(context.id)
            .then(() => context);
        }
        context.params.query[deleteField] = { $ne: true };
        return context;
      case 'remove':
        return Promise.resolve()
          .then(() => context.id ? throwIfItemDeleted(context.id) : null)
          .then(() => {
            context.data[deleteField] = true;
            context.params.query[deleteField] = { $ne: true };
            context.params.query.$disableSoftDelete = true;

            return service.patch(context.id, context.data, context.params)
              .then(result => {
                context.result = result;
                return context;
              });
          });
    }

    function throwIfItemDeleted (id, isGet) {
      const params = isGet ? context.params : {
        query: {},
        provider: context.params.provider,
        _populate: 'skip',
        authenticated: context.params.authenticated,
        user: context.params.user
      };

      params.query.$disableSoftDelete = true;

      return service.get(id, params)
        .then(data => {
          delete params.query.$disableSoftDelete;

          if (data[deleteField]) {
            throw new errors.NotFound('Item not found.');
          }
          return data;
        });
    }
  };
};
