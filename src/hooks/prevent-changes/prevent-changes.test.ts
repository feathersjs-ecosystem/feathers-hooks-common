import { assert, expect } from 'vitest'
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

    it('does not throw if props not found', async () => {
      await preventChanges(['name', 'address'], { error: true })(hookBefore)
      await preventChanges(['name.x', 'x.y.z'], { error: true })(hookBefore)
    })

    it('throw if props found', async () => {
      await expect(() =>
        preventChanges(['name', 'first'], { error: true })(hookBefore),
      ).rejects.toThrow()
      await expect(() =>
        preventChanges(['name', 'a'], { error: true })(hookBefore),
      ).rejects.toThrow()
      await expect(() =>
        preventChanges(['name', 'a.b'], { error: true })(hookBefore),
      ).rejects.toThrow()
      await expect(() =>
        preventChanges(['name', 'a.c'], { error: true })(hookBefore),
      ).rejects.toThrow()
      await expect(() =>
        preventChanges(['name', 'a.c.d.e'], { error: true })(hookBefore),
      ).rejects.toThrow()
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

    it('does not delete if props not found', async () => {
      let context: any = await preventChanges(['name', 'address'], { error: false })(
        clone(hookBefore),
      )
      assert.deepEqual(context, hookBefore)

      context = await preventChanges(['name.x', 'x.y.z'], { error: false })(clone(hookBefore))
      assert.deepEqual(context, hookBefore)
    })

    it('deletes if props found', async () => {
      let context: any = await preventChanges(['name', 'first'], { error: false })(
        clone(hookBefore),
      )
      assert.deepEqual(context.data, { last: 'Doe', a: { b: 'john', c: { d: { e: 1 } } } }, '1')

      context = await preventChanges(['name', 'a'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe' }, '2')

      context = await preventChanges(['name', 'a.b'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe', a: { c: { d: { e: 1 } } } }, '3')

      context = await preventChanges(['name', 'a.c'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { first: 'John', last: 'Doe', a: { b: 'john' } }, '4')

      context = await preventChanges(['name', 'a.c.d.e'], { error: false })(clone(hookBefore))
      assert.deepEqual(
        context.data,
        { first: 'John', last: 'Doe', a: { b: 'john', c: { d: {} } } },
        '5',
      )

      context = await preventChanges(['first', 'last'], { error: false })(clone(hookBefore))
      assert.deepEqual(context.data, { a: { b: 'john', c: { d: { e: 1 } } } })

      context = await preventChanges(['first', 'a.b', 'a.c.d.e'], { error: false })(
        clone(hookBefore),
      )
      assert.deepEqual(context.data, { last: 'Doe', a: { c: { d: {} } } })
    })
  })
})
