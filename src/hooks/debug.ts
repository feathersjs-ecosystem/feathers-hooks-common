/* eslint-disable no-console */
import type { HookContext } from '@feathersjs/feathers';

/**
 * Display the current hook context for debugging.
 * @see https://hooks-common.feathersjs.com/hooks.html#debug
 */
export function debug<H extends HookContext = HookContext>(msg: string, ...fieldNames: string[]) {
  return (context: H) => {
    // display timestamp
    const now = new Date();
    console.log(
      `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    );

    if (msg) {
      console.log(msg);
    }

    // display service, method & type of hook (before/after/error)
    console.log(`${context.type} service('${context.path}').${context.method}()`);

    // display id for get, patch, update & remove
    if (!['find', 'create'].includes(context.method) && 'id' in context) {
      console.log('id:', context.id);
    }

    if (context.data) {
      console.log('data:', context.data);
    }

    if (context.params?.query) {
      console.log('query:', context.params.query);
    }

    if (context.result) {
      console.log('result:', context.result);
    }

    // display additional params
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
