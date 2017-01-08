
export default function (hook, type = null, methods = [], label = 'anonymous') {
  if (type && hook.type !== type) {
    throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
  }

  if (!methods) { return; }

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(hook.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
}
