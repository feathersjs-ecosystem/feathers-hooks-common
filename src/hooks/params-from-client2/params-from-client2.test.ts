import { HookContext } from '@feathersjs/feathers';
import { paramsFromClient2 } from './params-from-client2';

describe('paramsFromClient2', () => {
  it('should move params to query._$client', () => {
    expect(
      paramsFromClient2(['a', 'b'])({
        params: {
          query: {
            _$client: {
              a: 1,
              b: 2,
            },
            c: 3,
          },
        },
      } as HookContext),
    ).toEqual({
      params: {
        a: 1,
        b: 2,
        query: {
          c: 3,
        },
      },
    });
  });

  it('should move params to query._$client and leave remaining', () => {
    expect(
      paramsFromClient2('a')({
        params: {
          query: {
            _$client: {
              a: 1,
              b: 2,
            },
            c: 3,
          },
        },
      } as HookContext),
    ).toEqual({
      params: {
        a: 1,
        query: {
          _$client: {
            b: 2,
          },
          c: 3,
        },
      },
    });
  });
});
