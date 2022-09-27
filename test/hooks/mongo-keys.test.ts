import { assert } from 'chai';
import { ObjectId } from 'mongodb';
import { mongoKeys } from '../../src';

const s0 = '000000000000';
const s1 = '111111111111';
const s2 = '222222222222';
const s5 = '555555555555';
const s8 = '888888888888';

describe('services mongoKeys', () => {
  it('{ a: s1, c: s0 }', () => {
    const newQuery = wrapper(['a'], { a: s1, c: s0 });

    assert.instanceOf(newQuery.a, ObjectId, '"a" not ObjectID');
    assert.isString(newQuery.c, '"c" not a string');
  });

  it('{ a: { b: s0 }, c: s0 }', () => {
    const newQuery = wrapper(['a'], { a: { b: s0 }, c: s0 });

    assert.isString(newQuery.a.b, '"a.b" not a string');
    assert.isString(newQuery.c, '"c" not a string');
  });

  it('{ a: { $in: [s1, s2] }, c: s0 }', () => {
    const newQuery = wrapper(['a'], { a: { $in: [s1, s2] }, c: s0 });

    assert.instanceOf(newQuery.a.$in[0], ObjectId, '"a.$in[0]" not ObjectID');
    assert.instanceOf(newQuery.a.$in[1], ObjectId, '"a.$in[1]" not ObjectID');
    assert.isString(newQuery.c, '"c" not a string');
  });

  it("{ a: s1, b: '111111111111', c: s0 }", () => {
    const newQuery = wrapper(['a', 'b'], { a: s1, b: s2, c: s0 });

    assert.instanceOf(newQuery.a, ObjectId, '"a" not ObjectID');
    assert.instanceOf(newQuery.b, ObjectId, '"b" not ObjectID');
    assert.isString(newQuery.c, '"c" not a string');
  });

  it('{ a: { x: s8 } }', () => {
    const newQuery = wrapper(['a.x'], { a: { x: s8 } });

    assert.instanceOf(newQuery.a.x, ObjectId, '"a.x" not ObjectID');
  });

  it('{ $or: [{ a: { x: s8 } }, { b: s5 }, { c: s0 }], d: s0 }', () => {
    const newQuery = wrapper(['a.x', 'b'], {
      $or: [{ a: { x: s8 } }, { b: s5 }, { c: s0 }],
      d: s0,
    });

    assert.instanceOf(newQuery.$or[0].a.x, ObjectId, '"$or[0].a.x" not ObjectID');
    assert.instanceOf(newQuery.$or[1].b, ObjectId, '"$or[1].b" not ObjectID');
    assert.isString(newQuery.$or[2].c, '"$or[2].c" not a string');
    assert.isString(newQuery.d, '"d" not a string');
  });

  it('{ $or: [{ a: { x: s8 } }, { a: s5 }] } - questionable', () => {
    const newQuery = wrapper(['a', 'a.x'], { $or: [{ a: { x: s8 } }, { a: s5 }] });

    assert.instanceOf(newQuery.$or[0].a.x, ObjectId, '"$or[0].a.x" not ObjectID');
    assert.instanceOf(newQuery.$or[1].a, ObjectId, '"$or[1].a" not ObjectID');
  });
});

function wrapper(keys: any, query: any) {
  const newContext: any = mongoKeys(
    ObjectId,
    keys
  )({ params: { query }, type: 'before', method: 'find' } as any);
  return newContext.params.query;
}
