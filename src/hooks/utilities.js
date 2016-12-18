
/*globals setImmediate:1 */

import feathersErrors from 'feathers-errors';
import { setByDot } from './utils';

const errors = feathersErrors.errors;

const reservedParamProps = [
  'authenticated', '__authenticated', 'mongoose', 'provider', 'sequelize', 'query'
];

export function disable (realm, ...args) {
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

export const $client = (...whitelist) => {
  whitelist.forEach(key => {
    if (reservedParamProps.indexOf(key) !== -1) {
      throw new errors.MethodNotAllowed(`${key} is a reserved Feathers prop name. ($client`);
    }
  });
  
  return hook => {
    whitelist = typeof whitelist === 'string' ? [whitelist] : whitelist;
    const params = hook.params;
    
    if (params && params.query && params.query.$client && typeof params.query.$client === 'object') {
      const client = params.query.$client;
      
      whitelist.forEach(key => {
        if (key in client) {
          params[key] = client[key];
        }
      });
      
      delete params.query.$client;
    }
    
    return hook;
  };
};

export const setSlug = (slug, field) => (hook) => {
  if (typeof field !== 'string') {
    field = `query.${slug}`;
  }
  
  if (hook.type === 'after') {
    throw new errors.GeneralError('Cannot set slug on after hook. (setSlug)');
  }
  
  if (hook.params && hook.params.provider === 'rest') {
    const value = hook.params[slug];
    if (typeof value === 'string' && value[0] !== ':') {
      setByDot(hook.params, field, value);
    }
  }
};

export const debug = msg => hook => {
  console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
  if (hook.data) { console.log('data:', hook.data); }
  if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
  if (hook.result) { console.log('result:', hook.result); }
};

export const callbackToPromise = (func, paramsCountExcludingCb) => {
  paramsCountExcludingCb = Math.max(paramsCountExcludingCb, 0);
  
  return (...args) => {
    const self = this;
    
    // Get the correct number of args
    const argsLen = args.length;
    if (argsLen < paramsCountExcludingCb) {
      // Array.apply(null, Array(5)) creates a dense array of 5 undefined
      const extraArgs = Array.apply(null, Array(paramsCountExcludingCb - argsLen));
      args = Array.prototype.concat.call(args, extraArgs);
    }
    if (args.length > paramsCountExcludingCb) {
      args = Array.prototype.slice.call(args, 0, paramsCountExcludingCb);
    }
    
    return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
      args.push((err, data) => (err ? reject(err) : resolve(data)));
      func.apply(self, args);
    });
  };
};

const asap = process && typeof process.nextTick === 'function'
  ? process.nextTick : setImmediate;

export const promiseToCallback = promise => cb => {
  promise.then(
    data => {
      asap(cb, null, data);
      return data;
    },
    err => {
      asap(cb, err);
    });
  
  return null;
};
