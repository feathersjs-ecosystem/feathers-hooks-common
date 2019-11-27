
const assert = require('assert').strict;
const hooks = require('../../lib/services');

describe('services traverse', () => {
  let hookBefore;
  let hookBeforeArray;
  let trimmer;
  let hookAfter;
  let hookAfterArray;

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

    trimmer = function (node) {
      if (typeof node === 'string') {
        this.update(node.trim());
      }
    };
  });

  it('transforms hook.data single item', () => {
    const result = clone(hookBefore);
    result.data = { a: 'a  b' };

    hooks.traverse(trimmer)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  it('transforms hook.data array of items', () => {
    const result = clone(hookBeforeArray);
    result.data = [{ a: 'a  b' }, { c: 'c' }];

    hooks.traverse(trimmer)(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  it('transforms hook.result single item', () => {
    const result = clone(hookAfter);
    result.result = { a: 'a  b' };

    hooks.traverse(trimmer)(hookAfter);

    assert.deepEqual(hookAfter, result);
  });

  it('transforms hook.result array of items', () => {
    const result = clone(hookAfterArray);
    result.result = [{ a: 'a  b' }, { c: 'c' }];

    hooks.traverse(trimmer)(hookAfterArray);

    assert.deepEqual(hookAfterArray, result);
  });

  it('transforms hook.params.query', () => {
    const result = clone(hookBefore);
    result.params.query = { b: 'b  b' };

    hooks.traverse(trimmer, hook => hook.params.query)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  it('transforms multiple objects within a hook', () => {
    const result = clone(hookBeforeArray);
    result.params = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };

    hooks.traverse(trimmer, hook => [hook.params.query, hook.params.something])(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  it('transforms objects', () => {
    const obj = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };
    const result = clone(obj);

    hooks.traverse(trimmer, obj)(hookBeforeArray);

    assert.deepEqual(obj, result);
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
