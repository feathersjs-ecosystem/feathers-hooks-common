
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('assert').strict;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services traverse', () => {
  let hookBefore: any;
  let hookBeforeArray: any;
  let trimmer: any;
  let hookAfter: any;
  let hookAfterArray: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      data: { a: ' a  b  ' },
      params: { query: { b: '  b  b  ' } }
    };

    hookBeforeArray = {
      type: 'before',
      method: 'create',
      data: [{ a: ' a  b  ' }, { c: ' c ' }],
      params: { query: { b: '  b  b  ' }, something: { c: ' c', d: 'd ' } }
    };

    hookAfter = {
      type: 'after',
      method: 'create',
      data: { q: 1 },
      params: { query: { b: '  b  b  ' } },
      result: { a: ' a  b  ' }
    };

    hookAfterArray = {
      type: 'after',
      method: 'create',
      data: { q: 1 },
      params: { query: { b: '  b  b  ' } },
      result: [{ a: ' a  b  ' }, { c: ' c ' }]
    };

    trimmer = function(this: any, node: any) {
      if (typeof node === 'string') {
        this.update(node.trim());
      }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms hook.data single item', () => {
    const result = clone(hookBefore);
    result.data = { a: 'a  b' };

    hooks.traverse(trimmer)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms hook.data array of items', () => {
    const result = clone(hookBeforeArray);
    result.data = [{ a: 'a  b' }, { c: 'c' }];

    hooks.traverse(trimmer)(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms hook.result single item', () => {
    const result = clone(hookAfter);
    result.result = { a: 'a  b' };

    hooks.traverse(trimmer)(hookAfter);

    assert.deepEqual(hookAfter, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms hook.result array of items', () => {
    const result = clone(hookAfterArray);
    result.result = [{ a: 'a  b' }, { c: 'c' }];

    hooks.traverse(trimmer)(hookAfterArray);

    assert.deepEqual(hookAfterArray, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms hook.params.query', () => {
    const result = clone(hookBefore);
    result.params.query = { b: 'b  b' };

    hooks.traverse(trimmer, (hook: any) => hook.params.query)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms multiple objects within a hook', () => {
    const result = clone(hookBeforeArray);
    result.params = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };

    hooks.traverse(trimmer, (hook: any) => [hook.params.query, hook.params.something])(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('transforms objects', () => {
    const obj = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };
    const result = clone(obj);

    hooks.traverse(trimmer, obj)(hookBeforeArray);

    assert.deepEqual(obj, result);
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
