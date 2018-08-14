
const stndMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'];

module.exports = function (context, type = null, methods = [], label = 'anonymous') {
  if (type && context.type !== type) {
    throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
  }

  if (!methods) { return; }
  if (stndMethods.indexOf(context.method) === -1) { return; } // allow custom methods

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(context.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
};
