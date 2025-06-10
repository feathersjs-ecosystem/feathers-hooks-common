import { assert, expect } from 'vitest'
import { feathers } from '@feathersjs/feathers'
import { MemoryService } from '@feathersjs/memory'
import { softDelete } from './soft-delete.js'

const initialUsers = [
  { name: 'Jane Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a' },
  { name: 'Jack Doe', key: 'a', deletedAt: new Date() },
  { name: 'Rick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b' },
  { name: 'Mick Doe', key: 'b', deletedAt: new Date() },
]

describe('softDelete', () => {
  let userService: any

  beforeEach(() => {
    const app = feathers().use(
      '/users',
      new MemoryService({
        multi: true,
      }),
    )

    userService = app.service('users')
    userService.hooks({
      before: {
        all: [
          softDelete({
            deletedQuery: { deletedAt: null },
            removeData: { deletedAt: new Date() },
          }),
        ],
      },
    })

    userService.create(initialUsers)
  })

  describe('find', () => {
    it('does not return deleted items', async () => {
      const users = await userService.find()

      assert.deepStrictEqual(users, [
        { name: 'Jane Doe', key: 'a', id: 0 },
        { name: 'Jack Doe', key: 'a', id: 1 },
        { name: 'Rick Doe', key: 'b', id: 3 },
        { name: 'Mick Doe', key: 'b', id: 4 },
      ])
    })

    it('returns everything with params.disableSoftDelete', async () => {
      const users = await userService.find({
        disableSoftDelete: true,
      })

      assert.deepStrictEqual(
        users.map((x: any) => x.id),
        [0, 1, 2, 3, 4, 5],
      )
    })
  })

  describe('get', () => {
    it('returns an undeleted item', async () => {
      const user = await userService.get(0)

      assert.deepStrictEqual(user, {
        name: 'Jane Doe',
        key: 'a',
        id: 0,
      })
    })

    it('throws on deleted item', async () => {
      await expect(async () => {
        await userService.get(2)
      }).rejects.toThrow()
    })

    it('returns deleted when params.disableSoftDelete is set', async () => {
      const user = await userService.get(2, {
        disableSoftDelete: true,
      })

      assert.ok(user.deletedAt)
    })

    it('throws on missing item', async () => {
      await expect(async () => {
        await userService.get(99)
      }).rejects.toThrow()
    })
  })

  describe('update, with id', () => {
    it('updates an undeleted item', async () => {
      const user = await userService.update(0, { y: 'y' })

      assert.deepStrictEqual(user, { y: 'y', id: 0 })
    })

    it.skip('throws on deleted item', async () => {
      await expect(async () => {
        await userService.update(2, { y: 'y' })
      }).rejects.toThrow()
    })
  })

  describe('patch', () => {
    it('patches an undeleted item', async () => {
      const user = await userService.patch(0, { y: 'y' })

      assert.deepStrictEqual(user, {
        name: 'Jane Doe',
        key: 'a',
        id: 0,
        y: 'y',
      })
    })

    it('throws on deleted item', async () => {
      await expect(() => userService.patch(2, { y: 'y' })).rejects.toThrow()
    })

    it('multi updates on undeleted items', async () => {
      const patched = await userService.patch(null, { x: 'x' })

      assert.deepStrictEqual(patched, [
        { name: 'Jane Doe', key: 'a', id: 0, x: 'x' },
        { name: 'Jack Doe', key: 'a', id: 1, x: 'x' },
        { name: 'Rick Doe', key: 'b', id: 3, x: 'x' },
        { name: 'Mick Doe', key: 'b', id: 4, x: 'x' },
      ])
    })
  })

  describe('remove, with id', () => {
    it('marks item as deleted', async () => {
      const user = await userService.remove(0)

      assert.equal(user.id, 0)
      assert.equal(!!user.deletedAt, true)

      await expect(() => userService.get(0)).rejects.toThrow()
    })

    it('throws if item already deleted', async () => {
      await expect(() => userService.remove(2)).rejects.toThrow()
    })
  })

  describe('remove, without id', () => {
    it('marks filtered items as deleted', async () => {
      const query = { key: 'a' }
      const removedUsers = await userService.remove(null, { query })

      assert.strictEqual(removedUsers.length, 2)

      const users = await userService.find({ query })

      assert.strictEqual(users.length, 0)

      const deletedUsers = await userService.find({
        query,
        disableSoftDelete: true,
      })

      assert.strictEqual(deletedUsers.length, 3)
    })

    it('handles nothing found', async () => {
      const users = await userService.remove(null, { query: { key: 'z' } })

      assert.strictEqual(users.length, 0)
    })
  })
})
