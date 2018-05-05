
module.exports = function (context, type = null, methods = [], label = 'anonymous') {
  if (type && context.type !== type) {
    throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
  }

  if (!methods) { return; }

  const myMethods = [].concat(methods); // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(context.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
};
