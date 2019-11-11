
const { assert } = require('chai');
const { preventChanges } = require('../../lib/services');

let hookBefore;

describe('services preventChanges', () => {
  describe('allowed for before patch', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
    });

    it('does not throw on before patch', () => {
      preventChanges('x')(hookBefore);
    });

    ['before', 'after'].forEach(type => {
      ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
        if (type !== 'before' || method !== 'patch') {
          it(`throws on ${type} ${method}`, () => {
            hookBefore.type = type;
            hookBefore.method = method;
            assert.throws(() => preventChanges('name')(hookBefore));
          });
        }
      });
    });
  });

  describe('checks props', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', 'name.first': 'John', a: { b: undefined, c: { d: { e: 1 } } } }
      };
    });

    it('does not throw if props not found', () => {
      preventChanges('name', 'address')(hookBefore);
      preventChanges('name.x', 'x.y.z')(hookBefore);
    });

    it('throw if props found', () => {
      assert.throw(() => preventChanges('name', 'first')(hookBefore));
      assert.throw(() => preventChanges('name', 'a')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.b')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c.d.e')(hookBefore));
      assert.throw(() => preventChanges('name.first')(hookBefore));
    });
  });

  describe('throws if first param is "true"', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } }
      };
    });

    it('does not throw if props not found', () => {
      preventChanges(true, 'name', 'address')(hookBefore);
      preventChanges(true, 'name.x', 'x.y.z')(hookBefore);
    });

    it('throw if props found', () => {
      assert.throw(() => preventChanges(true, 'name', 'first')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.b')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.c')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.c.d.e')(hookBefore));
    });
  });

  describe('deletes if first param is "false"', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } }
      };
    });

    it('does not delete if props not found', () => {
      let context = preventChanges(false, 'name', 'address')(clone(hookBefore));
      assert.deepEqual(context, hookBefore);

      context = preventChanges(false, 'name.x', 'x.y.z')(clone(hookBefore));
      assert.deepEqual(context, hookBefore);
    });

    it('deletes if props found', () => {
      let context = preventChanges(false, 'name', 'first')(clone(hookBefore));
      assert.deepEqual(context.data,
        { last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } },
        '1');

      context = preventChanges(false, 'name', 'a')(clone(hookBefore));
      assert.deepEqual(context.data,
        { first: 'John', last: 'Doe' },
        '2');

      context = preventChanges(false, 'name', 'a.b')(clone(hookBefore));
      assert.deepEqual(context.data,
        { first: 'John', last: 'Doe', a: { c: { d: { e: 1 } } } },
        '3');

      context = preventChanges(false, 'name', 'a.c')(clone(hookBefore));
      assert.deepEqual(context.data,
        { first: 'John', last: 'Doe', a: { b: 'john' } },
        '4');

      context = preventChanges(false, 'name', 'a.c.d.e')(clone(hookBefore));
      assert.deepEqual(context.data,
        { first: 'John', last: 'Doe', a: { b: 'john', c: { d: {} } } },
        '5');
    });
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
