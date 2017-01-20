
import feathersErrors from 'feathers-errors';

const errors = feathersErrors.errors;

export default function (realm, ...args) {
  console.log('DEPRECATED. Use disallow instead. (disable)');

  if (!realm) {
    return hook => {
      throw new errors.MethodNotAllowed(`Calling '${hook.method}' not allowed. (disable)`);
    };
  }

  if (typeof realm === 'function') {
    return hook => {
      const result = realm(hook);
      const update = check => {
        if (!check) {
          throw new errors.MethodNotAllowed(`Calling '${hook.method}' not allowed. (disable)`);
        }
      };

      if (result && typeof result.then === 'function') {
        return result.then(update);
      }

      update(result);
    };
  }

  const providers = [realm].concat(args);

  return hook => {
    const provider = hook.params.provider;

    if ((realm === 'external' && provider) || providers.indexOf(provider) !== -1) {
      throw new errors.MethodNotAllowed(
        `Provider '${hook.params.provider}' can not call '${hook.method}'. (disable)'`
      );
    }
  };
}
