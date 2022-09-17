import type { Application, Hook, Service } from '@feathersjs/feathers';

/**
 * Sequentially execute multiple sync or async hooks.
 * {@link https://hooks-common.feathersjs.com/hooks.html#combine}
 */
export function combine <A = Application, S = Service> (...serviceHooks: Hook<A, S>[]): Hook<A, S> {
  return function (context: any) {
    return processHooks(serviceHooks, context);
  };
}
