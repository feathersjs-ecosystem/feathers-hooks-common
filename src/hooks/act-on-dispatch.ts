import type { Application, Hook, Service } from '@feathersjs/feathers';
import { combine } from '../utils/combine';

/**
 * Runs a series of hooks which mutate context.data or context.result (the Feathers default).
 * {@link https://hooks-common.feathersjs.com/hooks.html#actondefault}
 */
export const actOnDefault = (...hooks: Hook[]) => actOn(undefined, ...hooks);

/**
 * Runs a series of hooks which mutate context.dispatch.
 * {@link https://hooks-common.feathersjs.com/hooks.html#actondispatch}
 */
export const actOnDispatch = (...hooks: Hook[]) => actOn('dispatch', ...hooks)

function actOn <A = Application, S = Service> (what: any, ...hooks: any[]): Hook<A, S> {
  return (context: any) => {
    const currActOn = context.params._actOn;
    context.params._actOn = what;

    return combine(...hooks)(context)
      // @ts-ignore
      .then((newContext: any) => {
        newContext.params._actOn = currActOn;

        return newContext;
      });
  };
}
