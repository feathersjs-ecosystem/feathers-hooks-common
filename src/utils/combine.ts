import type { Hook } from '@feathersjs/feathers';

import { hooks } from '@feathersjs/commons';
const { processHooks } = hooks

/**
 * Sequentially execute multiple sync or async hooks.
 * {@link https://hooks-common.feathersjs.com/hooks.html#combine}
 */
export function combine (...serviceHooks: Hook[]): Hook {
  return function (this: any, context: any) {
    return processHooks.call(this, serviceHooks, context);
  };
}
