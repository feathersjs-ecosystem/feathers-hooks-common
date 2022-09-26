import type { Application, Hook, Service } from '@feathersjs/feathers';
import { combine } from '../utils/combine';

/**
 * Runs a series of hooks which mutate context.data or context.result (the Feathers default).
 * @see https://hooks-common.feathersjs.com/hooks.html#actondefault
 */
export const actOnDefault = <A extends Application = Application, S extends Service = Service>(
  ...hooks: Hook<A, S>[]
) => actOn(undefined, ...hooks);

/**
 * Runs a series of hooks which mutate context.dispatch.
 * @see https://hooks-common.feathersjs.com/hooks.html#actondispatch
 */
export const actOnDispatch = <A extends Application = Application, S extends Service = Service>(
  ...hooks: Hook<A, S>[]
) => actOn('dispatch', ...hooks);

function actOn<A extends Application = Application, S extends Service = Service>(
  what: any,
  ...hooks: Hook<A, S>[]
): Hook<A, S> {
  return context => {
    // @ts-ignore
    const currActOn = context.params._actOn;
    // @ts-ignore
    context.params._actOn = what;

    return combine(...hooks)(context).then((newContext: any) => {
      newContext.params._actOn = currActOn;

      return newContext;
    });
  };
}
