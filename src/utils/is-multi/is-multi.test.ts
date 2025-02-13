import type { HookContext } from '@feathersjs/feathers';
import { isMulti } from './is-multi';

describe('isMulti', () => {
  it('returns true', function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
      } as HookContext;
      if (method === 'create') {
        context.data = [];
      }
      if (method === 'patch' || method === 'remove') {
        context.id = null as any;
      }
      return context;
    };
    ['before', 'after', 'around'].forEach(type => {
      ['find', 'create', 'patch', 'remove'].forEach(method => {
        const context = makeContext(type, method);
        assert.strictEqual(isMulti(context), true, `'${type}:${method}': returns true`);
      });
    });
  });

  it('returns false', function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
      } as HookContext;
      if (method === 'create') {
        context.data = {};
      }
      if (method === 'patch' || method === 'remove' || method === 'update') {
        context.id = 0;
      }

      return context;
    };
    ['before', 'after', 'around'].forEach(type => {
      ['get', 'create', 'update', 'patch', 'remove'].forEach(method => {
        const context = makeContext(type, method);
        assert.strictEqual(isMulti(context), false, `'${type}:${method}': returns false`);
      });
    });
  });
});
