
module.exports = function (...serviceHooks) {
  const isHookObject = function (hookObject) {
    return typeof hookObject === 'object' &&
    typeof hookObject.method === 'string' &&
    typeof hookObject.type === 'string';
  };

  return function (context) {
    let hookObject = context;

    const updateCurrentHook = (current) => {
      // Either use the returned hook object or the current
      // hook object from the chain if the hook returned undefined
      if (current) {
        if (!isHookObject(current)) {
          throw new Error(`${hookObject.type} hook for '${hookObject.method}' method returned invalid hook object`);
        }

        hookObject = current;
      }

      return hookObject;
    };
    // Go through all hooks and chain them into our promise
    const promise = serviceHooks.reduce((current, fn) => {
      // @ts-ignore
      const hook = fn.bind(this);

      // Use the returned hook object or the old one
      return current.then((currentHook) => hook(currentHook)).then(updateCurrentHook);
    }, Promise.resolve(hookObject));

    return promise.then(() => hookObject).catch(error => {
      // Add the hook information to any errors
      error.hook = hookObject;
      throw error;
    });
  };
};
