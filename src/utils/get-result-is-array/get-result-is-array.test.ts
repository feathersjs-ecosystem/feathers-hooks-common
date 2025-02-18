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

  it('dispatch', () => {
    const result = { a: 1, b: 2 };
    const dispatch = { c: 3, d: 4 };
    expect(getResultIsArray({ result, dispatch } as any, { dispatch: true })).toEqual({
      isArray: false,
      result: [dispatch],
      key: 'dispatch',
    });

    expect(
      getResultIsArray({ method: 'find', result, dispatch } as any, { dispatch: true }),
    ).toEqual({
      isArray: false,
      result: [dispatch],
      key: 'dispatch',
    });

    expect(
      getResultIsArray({ method: 'find', result: { data: result }, dispatch } as any, {
        dispatch: true,
      }),
    ).toEqual({
      isArray: false,
      result: [dispatch],
      key: 'dispatch',
    });
  });

  it('returns dispatch if is missing with single result', () => {
    const result = { a: 1, b: 2 };
    const context = { result } as any;
    expect(getResultIsArray(context, { dispatch: true })).toEqual({
      isArray: false,
      result: [result],
      key: 'result',
    });
    expect(context.dispatch).toEqual(undefined);
  });

  it("doesn't set dispatch if is missing with array result", () => {
    const result = [{ a: 1, b: 2 }];
    const context = { method: 'create', result } as any;

    expect(getResultIsArray(context, { dispatch: true })).toEqual({
      isArray: true,
      result: result,
      key: 'result',
    });
    expect(context.dispatch).toEqual(undefined);
  });

  it("doesn't set dispatch if is missing with find array", () => {
    const result = [{ a: 1, b: 2 }];
    const dispatch = undefined;
    const context = { method: 'find', result, dispatch } as any;

    expect(getResultIsArray(context, { dispatch: true })).toEqual({
      isArray: true,
      result,
      key: 'result',
    });
  });

  it('sets dispatch if is missing with paginated result', () => {
    const result = [{ a: 1, b: 2 }];
    const dispatch = undefined;
    const context = { method: 'find', result: { data: result, total: 3 }, dispatch } as any;

    expect(
      getResultIsArray(context, {
        dispatch: true,
      }),
    ).toEqual({
      isArray: true,
      result,
      key: 'result',
    });
    expect(context.dispatch).toEqual(undefined);
  });
});
