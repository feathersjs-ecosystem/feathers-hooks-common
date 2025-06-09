import { assert } from 'vitest'
import { trimResult } from './trim-result.js'
import type { HookContext } from '@feathersjs/feathers'

describe('lowercaseResult', () => {
  it('updates hook after::find with pagination', () => {
    const context = {
      type: 'after',
      method: 'find',
      result: {
        total: 2,
        data: [
          { first: 'John ', last: ' Doe' },
          { first: '   Jane ', last: 'Doe ' },
        ],
      },
    } as HookContext

    trimResult(['first', 'last'])(context)
    assert.deepEqual(context.result.data, [
      { first: 'John', last: 'Doe' },
      { first: 'Jane', last: 'Doe' },
    ])
  })

  it('updates hook after::find with no pagination', () => {
    const context = {
      type: 'after',
      method: 'find',
      result: [
        { first: ' John', last: 'Doe ' },
        { first: '    Jane     ', last: ' Doe' },
      ],
    } as HookContext
    trimResult(['first', 'last'])(context)
    assert.deepEqual(context.result, [
      { first: 'John', last: 'Doe' },
      { first: 'Jane', last: 'Doe' },
    ])
  })

  it('single result', () => {
    const context = {
      type: 'after',
      method: 'create',
      result: { first: ' Jane', last: 'Doe ' },
    } as HookContext
    trimResult(['first', 'last'])(context)

    assert.deepEqual(context.result, { first: 'Jane', last: 'Doe' })
  })

  it('single result dot notation', () => {
    const context = {
      type: 'after',
      method: 'create',
      result: { first: { name: ' Jane' }, last: 'Doe ' },
    } as HookContext
    trimResult('first.name')(context)

    assert.deepEqual(context.result, { first: { name: 'Jane' }, last: 'Doe ' })
  })
})
