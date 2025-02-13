import type { HookContext } from '@feathersjs/feathers';

/**
 * util to check if a hook is a multi hook:
 * - find: true
 * - get: false
 * - create: `context.data` is an array
 * - update: false
 * - patch: `context.id == null`
 * - remove: `context.id == null`
 */
export const isMulti = <H extends HookContext = HookContext>(context: H): boolean => {
  const { method } = context;
  if (method === 'find') {
    return true;
  } else if (method === 'patch' || method === 'remove') {
    return context.id == null;
  } else if (method === 'create') {
    return Array.isArray(context.data);
  } else if (method === 'get' || method === 'update') {
    return false;
  }

  return false;
};
