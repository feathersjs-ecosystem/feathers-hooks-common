import assert from 'node:assert'
import { BadRequest } from '@feathersjs/errors'
import { resolveData } from './resolve-data.js'
import type { HookContext } from '@feathersjs/feathers'

type User = {
  firstName: string
  lastName: string
  password: string
}

describe('resolve', () => {
  it('simple resolver', async () => {
    const context = {
      data: {
        firstName: 'Dave',
        lastName: 'L.',
      },
    } as unknown as HookContext

    const resolver = resolveData<User>({
      password: async (): Promise<undefined> => undefined,

      name: async (_value, user, ctx, status) => {
        assert.deepStrictEqual(ctx, context)
        assert.deepStrictEqual(status.path, ['name'])
        assert.strictEqual(typeof status.stack[0], 'function')

        return `${user.firstName} ${user.lastName}`
      },
    })

    const u = await await resolver(context)

    assert.deepStrictEqual(u.data, {
      firstName: 'Dave',
      lastName: 'L.',
      name: 'Dave L.',
    })
  })

  it('resolving with errors', async () => {
    const dummyResolver = resolve<{ name: string; age: number }, Record<string, unknown>>({
      properties: {
        name: async value => {
          if (value === 'Dave') {
            throw new Error(`No ${value}s allowed`)
          }

          return value
        },
        age: async value => {
          if (value && value < 18) {
            throw new BadRequest('Invalid age')
          }

          return value
        },
      },
    })

    assert.rejects(
      () =>
        dummyResolver.resolve(
          {
            name: 'Dave',
            age: 16,
          },
          {},
        ),
      {
        name: 'BadRequest',
        message: 'Error resolving data',
        code: 400,
        className: 'bad-request',
        data: {
          name: { message: 'No Daves allowed' },
          age: {
            name: 'BadRequest',
            message: 'Invalid age',
            code: 400,
            className: 'bad-request',
          },
        },
      },
    )
  })

  it('empty resolver returns original data', async () => {
    const resolver = resolve({
      properties: {},
    })
    const data = { message: 'Hello' }
    const resolved = await resolver.resolve(data, {})

    assert.strictEqual(data, resolved)
  })

  it('empty resolver still allows to select properties', async () => {
    const data = { message: 'Hello', name: 'David' }
    const resolver = resolve<typeof data, any>({
      properties: {},
    })
    const resolved = await resolver.resolve(data, {}, { properties: ['message'] })

    assert.deepStrictEqual(resolved, { message: 'Hello' })
  })
})
