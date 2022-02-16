
const stndMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'];

module.exports = function (context: any, type = null, methods = [], label = 'anonymous') {
  if (type) {
    const types = Array.isArray(type) ? type : [type]; // safe enough for allowed values
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    if (!types.includes(context.type)) {
      throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
    }
  }

  if (!methods) { return; }
  if (stndMethods.indexOf(context.method) === -1) { return; } // allow custom methods

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
  if (myMethods.length > 0 && myMethods.indexOf(context.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
};
