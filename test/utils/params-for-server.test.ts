
import { assert } from 'chai';

import {
  paramsForServer
} from '../../src';

describe('util paramsToServer', () => {
  it('handles empty params', () => {
    const res = paramsForServer();
    assert.deepEqual(res, { query: { $client: {} } });
  });

  it('handles params with query only', () => {
    const res = paramsForServer({ query: { x: 'x', y: 1 } });
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: {} } });
  });

  it('copies all params without query', () => {
    const res: any = paramsForServer({ a: 'a', b: 1 } as any);
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  it('copies all params with query', () => {
    const res: any = paramsForServer({ query: { x: 'x', y: 1 }, a: 'a', b: 1 } as any);
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: { a: 'a', b: 1 } } });
  });

  it('copies whitelist props', () => {
    const res: any = paramsForServer({ a: 'a', b: 1 } as any, 'a', 'b');
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  it('ignores non whitelist props', () => {
    const res: any = paramsForServer({ a: 'a', b: 1 } as any, 'b');
    assert.deepEqual(res, { query: { $client: { b: 1 } } });
  });
});
