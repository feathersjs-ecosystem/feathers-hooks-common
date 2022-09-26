import type { HookContext, Application, Service } from '@feathersjs/feathers';

export const hookTypes = ['around', 'before', 'after', 'error'] as const;
export type HookType = typeof hookTypes[number];

export const methodNames = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const;
export type MethodName = typeof methodNames[number];

export type TransportName = 'socketio' | 'rest' | 'external' | 'server';

export type SyncContextFunction<T, A = Application, S = Service> = (
  context: HookContext<A, S>
) => T;
export type AsyncContextFunction<T, A = Application, S = Service> = (
  context: HookContext<A, S>
) => Promise<T>;
export type ContextFunction<T, A = Application, S = Service> = (
  context: HookContext<A, S>
) => T | Promise<T>;

export type SyncPredicateFn<A = Application, S = Service> = SyncContextFunction<boolean, A, S>;
export type AsyncPredicateFn<A = Application, S = Service> = AsyncContextFunction<boolean, A, S>;
export type PredicateFn<A = Application, S = Service> = ContextFunction<boolean, A, S>;
