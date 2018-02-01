
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');

module.exports = function (prop) {
  const beforeField = prop || 'before';

  return context => {
    checkContext(context, 'before', ['get', 'update', 'patch', 'remove'], 'stashBefore');

    if (context.params.query && context.params.query.$disableStashBefore) {
      delete context.params.query.$disableStashBefore;
      return context;
    }

    if ((context.id === null || context.id === undefined) && !context.params.query) {
      throw new errors.BadRequest('Id is required. (stashBefore)');
    }

    if (context.params.before && context.params.before.id === context.id) {
      context.params[beforeField] = context.params.before;
      return context;
    }

    const params = context.method === 'get' ? context.params : {
      provider: context.params.provider,
      authenticated: context.params.authenticated,
      user: context.params.user
    };

    params.query = params.query || {};
    params.query.$disableStashBefore = true;

    return context.service.get(context.id, params)
      .then(data => {
        delete params.query.$disableStashBefore;

        const dataObject = JSON.parse(JSON.stringify(data));
        context.params[beforeField] = dataObject;
        context.params.before = dataObject;
        return context;
      })
      .catch(() => context);
  };
};
