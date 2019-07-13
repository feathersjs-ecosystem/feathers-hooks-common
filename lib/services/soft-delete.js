const checkContext = require('./check-context');

module.exports = function (field) {
  const deleteField = field || 'deleted';

  return function (context) {
    const { service, method, params: { query = {} } } = context;

    context.params.query = query;

    checkContext(context, 'before', null, 'softDelete');

    if (context.params.query.$disableSoftDelete) {
      delete context.params.query.$disableSoftDelete;
      return context;
    }

    context.params.query = Object.assign({}, {
      [deleteField]: { $ne: true }
    }, context.params.query);

    if (method === 'remove') {
      context.data[deleteField] = true;

      return service.patch(context.id, { [deleteField]: true }, context.params)
        .then(result => {
          context.result = result;
          return context;
        });
    }

    return context;
  };
};
