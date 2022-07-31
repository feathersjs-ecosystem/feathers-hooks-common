import type { HookContext, Params } from '@feathersjs/feathers';
import _get from 'lodash/get.js';
import _set from 'lodash/set.js';
import type { CallingParamsOptions, SyncContextFunction } from '../types';

const stndAuthProps = ['provider', 'authenticated', 'user']; // feathers-authentication
// App wide defaults
const defaults = {
  propNames: stndAuthProps,
  newProps: {}
};

/**
 * Set defaults for building params for service calls with callingParams. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#callingparamsdefaults}
 */
export function callingParamsDefaults (
  propNames: string[],
  newProps?: any
): void {
  if (propNames) {
    defaults.propNames = Array.isArray(propNames) ? propNames : [propNames];
  }

  if (newProps) {
    defaults.newProps = newProps;
  }
}

/**
 * Build params for a service call. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#callingparams}
 */
export function callingParams ({
  query,
  propNames = [],
  newProps = {},
  hooksToDisable = [],
  ignoreDefaults
}: CallingParamsOptions = {}): SyncContextFunction<Params> {
  return (context: any) => {
    propNames = Array.isArray(propNames) ? propNames : [propNames];
    hooksToDisable = Array.isArray(hooksToDisable) ? hooksToDisable : [hooksToDisable];

    const newParams: Params = query ? { query } : {};
    const allPropNames = ignoreDefaults ? propNames : [...defaults.propNames, ...propNames];

    allPropNames.forEach(name => {
      if (name) { // for makeCallingParams compatibility
        const value = _get(context.params, name);

        if (value !== undefined) {
          _set(newParams, name, value);
        }
      }
    });

    Object.assign(newParams, ignoreDefaults ? {} : defaults.newProps, newProps);

    hooksToDisable.forEach(name => {
      switch (name) {
      case 'populate': // fall through
      case 'fastJoin':
        newParams._populate = 'skip';
        break;
      case 'softDelete':
        newParams.query = newParams.query || {};
        newParams.query.$disableSoftDelete = true;
        break;
      case 'softDelete2':
        newParams.$disableSoftDelete2 = true;
        break;
      case 'ignoreDeletedAt':
        newParams.$ignoreDeletedAt = true;
        break;
      case 'stashBefore':
        newParams.disableStashBefore = true;
        break;
      }
    });

    return newParams;
  };
}

/**
 * You should prefer using the callingParams utility to makeCallingParams.
 * Build context.params for service calls. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#makecallingparams}
 */
export function makeCallingParams (
  context: HookContext,
  query?: any,
  include?: string | string[],
  inject = {}
) {
  return callingParams({
    query,
    propNames: include === undefined
      ? ['provider', 'authenticated', 'user']
      : Array.isArray(include)
        ? include
        : [include],
    newProps: Object.assign({}, { _populate: 'skip' }, inject),
    ignoreDefaults: true
  })(context);
}
