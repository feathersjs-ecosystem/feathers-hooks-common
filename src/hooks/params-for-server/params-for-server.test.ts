import { HookContext } from '@feathersjs/feathers';
import { paramsForServer } from './params-for-server';

describe('paramsForServer', () => {
  it('should move params to query._$client', () => {
    expect(
      paramsForServer(['a', 'b'])({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        query: {
          _$client: {
            a: 1,
            b: 2,
          },
        },
      },
    });
  });

  it('should move params to query._$client and leave remaining', () => {
    expect(
      paramsForServer('a')({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        b: 2,
        query: {
          _$client: {
            a: 1,
          },
        },
      },
    });
  });
});
