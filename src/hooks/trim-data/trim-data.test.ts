import { assert } from 'vitest'
import type { HookContext } from '@feathersjs/feathers'
import { trimData } from './trim-data.js'

describe('trimData', () => {
  it('updates hook before::create', () => {
    const context = {
      type: 'before',
      method: 'create',
      data: { first: ' John', last: 'Doe ' },
    } as HookContext
    trimData(['first', 'last'])(context)
    assert.deepEqual(context.data, { first: 'John', last: 'Doe' })
  })

  it('does not throw if field is missing', () => {
    const context = { type: 'before', method: 'create', data: { last: ' Doe ' } } as HookContext
    trimData(['first', 'last'])(context)
    assert.deepEqual(context.data, { last: 'Doe' })
  })

  it('does not throw if field is undefined', () => {
    const context = {
      type: 'before',
      method: 'create',
      data: { first: undefined, last: ' Doe' },
    } as HookContext
    trimData(['first', 'last'])(context)
    assert.deepEqual(context.data, { first: undefined, last: 'Doe' })
  })

  it('does not throw if field is null', () => {
    const context = {
      type: 'before',
      method: 'create',
      data: { first: null, last: 'Doe ' },
    } as HookContext
    trimData(['first', 'last'])(context)
    assert.deepEqual(context.data, { first: null, last: 'Doe' })
  })

  it('throws if field is not a string', async () => {
    const context = {
      type: 'before',
      method: 'create',
      data: { first: 1, last: 'Doe' },
    } as HookContext
    await expect(async () => {
      await trimData(['first', 'last'])(context)
    }).rejects.toThrow('Expected string data. (trim first)')
  })

  it('prop with 1 dot', () => {
    const context = {
      data: { empl: { name: { first: 'John', last: 'Doe' }, status: ' AA' }, dept: ' Acct' },
    } as HookContext
    trimData('empl.status')(context)

    assert.deepEqual(context.data, {
      empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      dept: ' Acct',
    })
  })

  it('prop with 2 dots', () => {
    const context = {
      data: { empl: { name: { first: ' John', last: 'Doe' }, status: 'AA' }, dept: ' Acct' },
    } as HookContext
    trimData('empl.name.first')(context)

    assert.deepEqual(context.data, {
      empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      dept: ' Acct',
    })
  })
})
