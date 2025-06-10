import { BadRequest } from '@feathersjs/errors'
import { throwIfIsMulti } from './throw-if-is-multi.js'
import type { HookContext } from '@feathersjs/feathers'

describe('throwIfIsMulti', () => {
  describe('general', () => {
    it('does not throw on find', async () => {
      const context = {
        method: 'find',
        params: { query: { name: 'item1' } },
      } as HookContext

      await throwIfIsMulti()(context)
    })

    it('does not throw on get', async () => {
      const context = {
        method: 'get',
        id: 'item1',
      } as HookContext
      await throwIfIsMulti()(context)
    })

    it('does not throw on single create', async () => {
      const context = {
        method: 'create',
        data: { name: 'item1' },
      } as HookContext

      await throwIfIsMulti()(context)
    })

    it('does not throw on single update', async () => {
      const context = {
        method: 'update',
        id: 'item1',
        data: { name: 'item1' },
      } as HookContext

      await throwIfIsMulti()(context)
    })

    it('does not throw on single patch', async () => {
      const context = {
        method: 'patch',
        id: 'item1',
        data: { name: 'item1' },
      } as HookContext

      await throwIfIsMulti()(context)
    })

    it('does not throw on single remove', async () => {
      const context = {
        method: 'remove',
        id: 'item1',
      } as HookContext

      await throwIfIsMulti()(context)
    })
  })

  it('throws on multi create by default', async () => {
    const context = {
      method: 'create',
      data: [{ name: 'item1' }, { name: 'item2' }],
    } as HookContext

    await expect(() => throwIfIsMulti()(context)).rejects.toThrow(BadRequest)
  })

  it('throws on multi patch by default', async () => {
    const context = {
      method: 'patch',
      id: null,
      data: { name: 'item1' },
    } as any as HookContext

    await expect(() => throwIfIsMulti()(context)).rejects.toThrow(BadRequest)
  })

  it('throws on multi remove by default', async () => {
    const context = {
      method: 'remove',
      id: null,
    } as any as HookContext

    await expect(() => throwIfIsMulti()(context)).rejects.toThrow(BadRequest)
  })

  describe('with filter', () => {
    it('filter function has context as argument', async () => {
      const filterFn = vi.fn(() => true)
      const context = {
        method: 'create',
        data: [{ name: 'item1' }, { name: 'item2' }],
      } as HookContext
      await expect(() => throwIfIsMulti({ filter: filterFn })(context)).rejects.toThrow(BadRequest)
      expect(filterFn).toHaveBeenCalledWith(context)
    })

    it('does not throw on multi create if filter returns false', async () => {
      const context = {
        method: 'create',
        data: [{ name: 'item1' }, { name: 'item2' }],
      } as HookContext

      await expect(() => throwIfIsMulti()(context)).rejects.toThrow(BadRequest)

      // sync
      await expect(
        throwIfIsMulti({
          filter: () => false,
        })(context),
      ).resolves.not.toThrow()

      // async
      await expect(
        throwIfIsMulti({
          filter: async () => false,
        })(context),
      ).resolves.not.toThrow()
    })

    it('throws on multi create if filter returns true', async () => {
      const context = {
        method: 'create',
        data: [{ name: 'item1' }, { name: 'item2' }],
      } as HookContext

      // sync
      await expect(() =>
        throwIfIsMulti({
          filter: () => true,
        })(context),
      ).rejects.toThrow()

      // async
      await expect(() =>
        throwIfIsMulti({
          filter: async () => true,
        })(context),
      ).rejects.toThrow()
    })
  })
})
