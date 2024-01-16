import type { HookContext, Params } from '@feathersjs/feathers';
import _get from 'lodash/get.js';
import _set from 'lodash/set.js';

export type Disablable =
  | 'populate'
  | 'fastJoin'
  | 'ignoreDeletedAt'
  | 'softDelete'
  | 'softDelete2'
  | 'stashBefore';

export interface CallingParamsOptions {
  /**
   * The params.query for the calling params.
   */
  query?: any;
  /**
   * The names of the props in context.params to include in the new params.
   */
  propNames?: string[];
  /**
   * Additional props to add to the new params.
   */
  newProps?: any;
  /**
   * The names of hooks to disable during the service call. populate, fastJoin, softDelete and stashBefore are supported.
   */
  hooksToDisable?: Disablable[] | Disablable;
  /**
   *    Ignore the defaults propNames and newProps.
   */
  ignoreDefaults?: boolean;
}

const stndAuthProps = ['provider', 'authenticated', 'user']; // feathers-authentication
// App wide defaults
const defaults = {
  propNames: stndAuthProps,
  newProps: {},
};

/**
 * Set defaults for building params for service calls with callingParams. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#callingparamsdefaults
 */
export function callingParamsDefaults(propNames: string[], newProps?: any): void {
  if (propNames) {
    defaults.propNames = Array.isArray(propNames) ? propNames : [propNames];
  }

  if (newProps) {
    defaults.newProps = newProps;
  }
}

/**
 * Build params for a service call. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#callingparams
 */
export function callingParams<H extends HookContext = HookContext>({
  query,
  propNames = [],
  newProps = {},
  hooksToDisable = [],
  ignoreDefaults,
}: CallingParamsOptions = {}) {
  return (context: H) => {
    propNames = Array.isArray(propNames) ? propNames : [propNames];
    hooksToDisable = Array.isArray(hooksToDisable) ? hooksToDisable : [hooksToDisable];

    const newParams: Params = query ? { query } : {};
    const allPropNames = ignoreDefaults ? propNames : [...defaults.propNames, ...propNames];

    allPropNames.forEach(name => {
      if (name) {
        // for makeCallingParams compatibility
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
          // @ts-ignore
          newParams._populate = 'skip';
          break;
        case 'softDelete':
          newParams.query = newParams.query || {};
          newParams.query.$disableSoftDelete = true;
          break;
        case 'softDelete2':
          // @ts-ignore
          newParams.$disableSoftDelete2 = true;
          break;
        case 'ignoreDeletedAt':
          // @ts-ignore
          newParams.$ignoreDeletedAt = true;
          break;
        case 'stashBefore':
          // @ts-ignore
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
 * @see https://hooks-common.feathersjs.com/utilities.html#makecallingparams
 */
export function makeCallingParams<H extends HookContext = HookContext>(
  context: H,
  query?: any,
  include?: string | string[],
  inject = {},
) {
  return callingParams({
    query,
    propNames:
      include === undefined
        ? ['provider', 'authenticated', 'user']
        : Array.isArray(include)
          ? include
          : [include],
    newProps: Object.assign({}, { _populate: 'skip' }, inject),
    ignoreDefaults: true,
  })(context);
}
