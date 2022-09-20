
import { assert } from 'chai';
import { makeCallingParams } from '../../src';

let context: any;

describe('util calling-params-2.test.js', () => {
  beforeEach(() => {
    context = { query: { aaa: 'bbb' }, params: { foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } };
  });

  it('retains default context', () => {
    const res: any = makeCallingParams(context);
    assert.deepEqual(res, { _populate: 'skip', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
  });

  it('sets query', () => {
    const res: any = makeCallingParams(context, { a: 1 });
    assert.deepEqual(res, { query: { a: 1 }, _populate: 'skip', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
  });

  it('sets include string', () => {
    const res: any = makeCallingParams(context, null, 'foo');
    assert.deepEqual(res, { foo: 'bar', _populate: 'skip' });
  });

  it('sets include array', () => {
    const res: any = makeCallingParams(context, null, ['foo', 'baz']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  it('sets include skip missing names', () => {
    const res: any = makeCallingParams(context, null, ['foo', 'baz', 'x']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  it('injects', () => {
    // @ts-ignore
    const res: any = makeCallingParams(context, null, null, { aa: 2 });
    assert.deepEqual(res, { aa: 2, _populate: 'skip' });
  });

  it('injects overwrites _populate', () => {
    // @ts-ignore
    const res: any = makeCallingParams(context, null, null, { _populate: false });
    assert.deepEqual(res, { _populate: false });
  });

  it('all work together', () => {
    const res: any = makeCallingParams(context, { a: 1 }, ['foo', 'baz', 'x'], { aa: 2 });
    assert.deepEqual(res, { query: { a: 1 }, foo: 'bar', baz: 'faz', aa: 2, _populate: 'skip' });
  });
});
