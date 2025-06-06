import type { HookContext } from '@feathersjs/feathers'
import { paramsFromClient } from './params-from-client.js'

describe('paramsFromClient', () => {
  it('should move params to query._$client', () => {
    expect(
      paramsFromClient(['a', 'b'])({
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
    })
  })

  it('should move params to query._$client and leave remaining', () => {
    expect(
      paramsFromClient('a')({
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
    })
  })
})
