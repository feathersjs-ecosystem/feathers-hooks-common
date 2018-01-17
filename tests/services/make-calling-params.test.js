
const { assert } = require('chai');
const { makeCallingParams } = require('../../lib');

let context;

describe('service make-calling-params.test.js', () => {
  beforeEach(() => {
    context = { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', params: { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } };
  });

  it('retains default context', () => {
    const res = makeCallingParams(context);
    assert.deepEqual(res, { _populate: 'skip', params: { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } });
  });

  it('sets query', () => {
    const res = makeCallingParams(context, { a: 1 });
    assert.deepEqual(res, { query: { a: 1 }, _populate: 'skip', params: { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } });
  });

  it('sets include string', () => {
    const res = makeCallingParams(context, null, 'foo');
    assert.deepEqual(res, { foo: 'bar', _populate: 'skip' });
  });

  it('sets include array', () => {
    const res = makeCallingParams(context, null, ['foo', 'baz']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  it('sets include skip missing names', () => {
    const res = makeCallingParams(context, null, ['foo', 'baz', 'x']);
    assert.deepEqual(res, { foo: 'bar', baz: 'faz', _populate: 'skip' });
  });

  it('injects', () => {
    const res = makeCallingParams(context, null, null, { aa: 2 });
    assert.deepEqual(res, { aa: 2, _populate: 'skip' });
  });

  it('injects params by dot', () => {
    const res = makeCallingParams(context, null, 'params.user', { aa: 2 });
    assert.deepEqual(res, { aa: 2, _populate: 'skip', params: { user: { name: 'Matt' } } });
  });

  it('injects overwrites _populate', () => {
    const res = makeCallingParams(context, null, null, { _populate: false });
    assert.deepEqual(res, { _populate: false });
  });

  it('all work together', () => {
    const res = makeCallingParams(context, { a: 1 }, ['foo', 'baz', 'x'], { aa: 2 });
    assert.deepEqual(res, { query: { a: 1 }, foo: 'bar', baz: 'faz', aa: 2, _populate: 'skip' });
  });
});
