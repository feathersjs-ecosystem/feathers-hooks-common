/* eslint-disable no-console */
import type { Application, Hook, Service } from '@feathersjs/feathers';

/**
 * Display the current hook context for debugging.
 * @see https://hooks-common.feathersjs.com/hooks.html#debug
 */
export function debug<A extends Application = Application, S extends Service = Service>(
  msg: string,
  ...fieldNames: string[]
): Hook<A, S> {
  return context => {
    console.log(`* ${msg || ''}\ntype:${context.type}, method: ${context.method}`);
    if (context.data) {
      console.log('data:', context.data);
    }
    if (context.params && context.params.query) {
      console.log('query:', context.params.query);
    }
    if (context.result) {
      console.log('result:', context.result);
    }

    const params = context.params || {};
    console.log('params props:', Object.keys(params).sort());

    fieldNames.forEach(name => {
      // @ts-ignore
      console.log(`params.${name}:`, params[name]);
    });

    if (context.error) {
      console.log('error', context.error);
    }
  };
}
