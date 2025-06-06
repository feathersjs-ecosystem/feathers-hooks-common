import { assert } from 'vitest'
import { preventChanges } from './prevent-changes.js'
import { clone } from '../../common/index.js'

let hookBefore: any

describe('preventChanges', () => {
  describe('throws if first param is "true"', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } },
      }
    })

    it('does not throw if props not found', () => {
      preventChanges(['name', 'address'], { error: true })(hookBefore)
      preventChanges(['name.x', 'x.y.z'], { error: true })(hookBefore)
    })

    it('throw if props found', () => {
      assert.throw(() => preventChanges(['name', 'first'], { error: true })(hookBefore))
      assert.throw(() => preventChanges(['name', 'a'], { error: true })(hookBefore))
      assert.throw(() => preventChanges(['name', 'a.b'], { error: true })(hookBefore))
      assert.throw(() => preventChanges(['name', 'a.c'], { error: true })(hookBefore))
      assert.throw(() => preventChanges(['name', 'a.c.d.e'], { error: true })(hookBefore))
    })
  })

  describe('deletes if first param is "false"', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } },
      }
    })

    it('does not delete if props not found', () => {
      let context: any = preventChanges(['name', 'address'], { error: false })(clone(hookBefore))
      assert.deepEqual(context, hookBefore)

      context = preventChanges(['name.x', 'x.y.z'], { error: false })(clone(hookBefore))
      assert.deepEqual(context, hookBefore)
    })

    it('deletes if props found', () => {
      let context: any = preventChanges(['name', 'first'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } }, '1')

      context = preventChanges(['name', 'a'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe' }, '2')

      context = preventChanges(['name', 'a.b'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe', a: { c: { d: { e: 1 } } } }, '3')

      context = preventChanges(['name', 'a.c'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe', a: { b: 'john' } }, '4')

      context = preventChanges(['name', 'a.c.d.e'], { error: false })(clone(hookBefore))
      assert.deepEqual(
        context.data,
        { first: 'John', last: 'Doe', a: { b: 'john', c: { d: {} } } },
        '5',
      )

      context = preventChanges(['first', 'last'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { a: { b: 'john', c: { d: { e: 1 } } } })

      context = preventChanges(['first', 'a.b', 'a.c.d.e'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { last: 'Doe', a: { c: { d: {} } } })
    })
  })
})
