
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preventCha... Remove this comment to see the full error message
const { preventChanges } = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services preventChanges', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('allowed for before patch', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw on before patch', () => {
      preventChanges('x')(hookBefore);
    });

    ['before', 'after'].forEach(type => {
      ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
        if (type !== 'before' || method !== 'patch') {
          // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`throws on ${type} ${method}`, () => {
            hookBefore.type = type;
            hookBefore.method = method;
            assert.throws(() => preventChanges('name')(hookBefore));
          });
        }
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('checks props', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', 'name.first': 'John', a: { b: undefined, c: { d: { e: 1 } } } }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw if props not found', () => {
      preventChanges('name', 'address')(hookBefore);
      preventChanges('name.x', 'x.y.z')(hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throw if props found', () => {
      assert.throw(() => preventChanges('name', 'first')(hookBefore));
      assert.throw(() => preventChanges('name', 'a')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.b')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c.d.e')(hookBefore));
      assert.throw(() => preventChanges('name.first')(hookBefore));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('throws if first param is "true"', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw if props not found', () => {
      preventChanges(true, 'name', 'address')(hookBefore);
      preventChanges(true, 'name.x', 'x.y.z')(hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throw if props found', () => {
      assert.throw(() => preventChanges(true, 'name', 'first')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.b')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.c')(hookBefore));
      assert.throw(() => preventChanges(true, 'name', 'a.c.d.e')(hookBefore));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('deletes if first param is "false"', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not delete if props not found', () => {
      let context = preventChanges(false, 'name', 'address')(clone(hookBefore));
      assert.deepEqual(context, hookBefore);

      context = preventChanges(false, 'name.x', 'x.y.z')(clone(hookBefore));
      assert.deepEqual(context, hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
