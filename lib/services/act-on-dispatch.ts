
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'combine'.
const combine = require('./combine');

module.exports = {
  actOnDefault: (...hooks: any[]) => actOn(undefined, ...hooks),
  actOnDispatch: (...hooks: any[]) => actOn('dispatch', ...hooks)
};

function actOn (what: any, ...hooks: any[]) {
  return (context: any) => {
    const currActOn = context.params._actOn;
    context.params._actOn = what;

    return combine(...hooks)(context)
      .then((newContext: any) => {
        newContext.params._actOn = currActOn;

        return newContext;
      });
  };
}
