import { getDataIsArray } from './get-data-is-array.js'

describe('getDataIsArray', () => {
  it('falsy data', () => {
    expect(getDataIsArray({ data: null } as any)).toEqual({
      isArray: false,
      data: [],
    })

    expect(getDataIsArray({ data: undefined } as any)).toEqual({
      isArray: false,
      data: [],
    })
  })

  it('array data', () => {
    const data = [1, 2, 3]
    expect(getDataIsArray({ data } as any)).toEqual({
      isArray: true,
      data,
    })
  })

  it('non-array data', () => {
    const data = { a: 1, b: 2 }
    expect(getDataIsArray({ data } as any)).toEqual({
      isArray: false,
      data: [data],
    })
  })
})
