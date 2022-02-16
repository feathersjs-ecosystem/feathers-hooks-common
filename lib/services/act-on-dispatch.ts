
const combine = require('./combine');

module.exports = {
  actOnDefault: (...hooks) => actOn(undefined, ...hooks),
  actOnDispatch: (...hooks) => actOn('dispatch', ...hooks)
};

function actOn (what, ...hooks) {
  return context => {
    const currActOn = context.params._actOn;
    context.params._actOn = what;

    return combine(...hooks)(context)
      .then(newContext => {
        newContext.params._actOn = currActOn;

        return newContext;
      });
  };
}
