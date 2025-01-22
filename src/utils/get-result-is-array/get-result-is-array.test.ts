import { getResultIsArray } from './get-result-is-array';

describe('getResultIsArray', () => {
  it('falsy result', () => {
    expect(getResultIsArray({ result: null } as any)).toEqual({
      isArray: false,
      result: [],
      key: 'result',
    });

    expect(getResultIsArray({} as any)).toEqual({
      isArray: false,
      result: [],
      key: 'result',
    });
  });

  it('array result', () => {
    const result = [1, 2, 3];
    expect(getResultIsArray({ result } as any)).toEqual({
      isArray: true,
      result,
      key: 'result',
    });

    expect(getResultIsArray({ method: 'find', result } as any)).toEqual({
      isArray: true,
      result,
      key: 'result',
    });

    expect(getResultIsArray({ method: 'find', result: { data: result } } as any)).toEqual({
      isArray: true,
      result,
      key: 'result',
    });
  });

  it('non-array result', () => {
    const result = { a: 1, b: 2 };
    expect(getResultIsArray({ result } as any)).toEqual({
      isArray: false,
      result: [result],
      key: 'result',
    });

    expect(getResultIsArray({ method: 'find', result } as any)).toEqual({
      isArray: false,
      result: [result],
      key: 'result',
    });

    expect(getResultIsArray({ method: 'find', result: { data: result } } as any)).toEqual({
      isArray: false,
      result: [result],
      key: 'result',
    });
  });
});
