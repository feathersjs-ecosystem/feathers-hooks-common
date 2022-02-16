
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');

module.exports = function (prop: any) {
  const beforeField = prop || 'before';

  return (context: any) => {
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
      .then((data: any) => {
        context.params[beforeField] = JSON.parse(JSON.stringify(data));
        return context;
      })
      .catch(() => context);
  };
};
