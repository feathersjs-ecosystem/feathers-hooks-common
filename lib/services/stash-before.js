
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');

module.exports = function (prop) {
  const beforeField = prop || 'before';

  return context => {
    checkContext(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    if (context.params.disableStashBefore) {
      return context;
    }

    if ((context.id === null || context.id === undefined) && !context.params.query) {
      throw new errors.BadRequest('Id is required. (stashBefore)');
    }

    const params = context.method === 'get'
      ? context.params
      : {
          provider: context.params.provider,
          authenticated: context.params.authenticated,
          user: context.params.user
        };

    return context.service.get(context.id, {
      ...params,
      query: params.query || {},
      disableStashBefore: true
    })
      .then(data => {
        context.params[beforeField] = JSON.parse(JSON.stringify(data));
        return context;
      })
      .catch(() => context);
  };
};
