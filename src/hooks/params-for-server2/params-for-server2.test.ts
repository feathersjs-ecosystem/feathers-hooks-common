import { HookContext } from '@feathersjs/feathers';
import { paramsForServer2 } from './params-for-server2';

describe('paramsForServer2', () => {
  it('should move params to query._$client', () => {
    expect(
      paramsForServer2(['a', 'b'])({
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
      paramsForServer2('a')({
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
