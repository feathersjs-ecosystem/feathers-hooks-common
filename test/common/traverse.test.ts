import { assert } from 'chai';
import { traverse } from '../../src';

describe('services traverse', () => {
  let hookBefore: any;
  let hookBeforeArray: any;
  let trimmer: any;
  let hookAfter: any;
  let hookAfterArray: any;

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

    trimmer = function (this: any, node: any) {
      if (typeof node === 'string') {
        this.update(node.trim());
      }
    };
  });

  it('transforms hook.data single item', () => {
    const result = clone(hookBefore);
    result.data = { a: 'a  b' };

    traverse(trimmer)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  it('transforms hook.data array of items', () => {
    const result = clone(hookBeforeArray);
    result.data = [{ a: 'a  b' }, { c: 'c' }];

    traverse(trimmer)(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  it('transforms hook.result single item', () => {
    const result = clone(hookAfter);
    result.result = { a: 'a  b' };

    traverse(trimmer)(hookAfter);

    assert.deepEqual(hookAfter, result);
  });

  it('transforms hook.result array of items', () => {
    const result = clone(hookAfterArray);
    result.result = [{ a: 'a  b' }, { c: 'c' }];

    traverse(trimmer)(hookAfterArray);

    assert.deepEqual(hookAfterArray, result);
  });

  it('transforms hook.params.query', () => {
    const result = clone(hookBefore);
    result.params.query = { b: 'b  b' };

    traverse(trimmer, (hook: any) => hook.params.query)(hookBefore);

    assert.deepEqual(hookBefore, result);
  });

  it('transforms multiple objects within a hook', () => {
    const result = clone(hookBeforeArray);
    result.params = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };

    traverse(trimmer, (hook: any) => [hook.params.query, hook.params.something])(hookBeforeArray);

    assert.deepEqual(hookBeforeArray, result);
  });

  it('transforms objects', () => {
    const obj: any = { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } };
    const result = clone(obj);

    traverse(trimmer, obj)(hookBeforeArray);

    assert.deepEqual(obj, result);
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
