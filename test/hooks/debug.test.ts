import { debug } from '../../src';

describe('services debug', () => {
  it('does not crash', () => {
    const hook: any = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' } },
      result: { c: 'c' },
    };
    debug('my message')(hook);
  });

  it('display params props', () => {
    const hook: any = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' }, foo: 'bar' },
      result: { c: 'c' },
    };
    debug('my message', 'query', 'foo')(hook);
  });
});
