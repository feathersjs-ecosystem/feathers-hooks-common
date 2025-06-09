import assert from 'node:assert'
import { BadRequest } from '@feathersjs/errors'
import { resolveResult } from './resolve-result.js'
import type { HookContext } from '@feathersjs/feathers'

type User = {
  firstName: string
  lastName: string
  password: string
}

describe('resolve-result', () => {
  it('simple resolver', async () => {
    const context = {
      result: {
        firstName: 'Dave',
        lastName: 'L.',
      },
    } as unknown as HookContext

    const u = await resolveResult<User>({
      password: async (): Promise<undefined> => undefined,

      name: async (_value, user, ctx, status) => {
        assert.deepStrictEqual(ctx, context)
        assert.deepStrictEqual(status.path, ['name'])
        assert.strictEqual(typeof status.stack[0], 'function')

        return `${user.firstName} ${user.lastName}`
      },
    })(context)

    assert.deepStrictEqual(u.result, {
      firstName: 'Dave',
      lastName: 'L.',
      name: 'Dave L.',
    })
  })

  it('array result on create', async () => {
    const context = {
      method: 'create',
      result: [
        {
          firstName: 'Dave',
          lastName: 'L.',
        },
        {
          firstName: 'Fred',
          lastName: 'F.',
        },
      ],
    } as unknown as HookContext

    const u = await resolveResult<User>({
      password: async (): Promise<undefined> => undefined,

      name: async (_value, user, ctx, status) => {
        assert.deepStrictEqual(ctx, context)
        assert.deepStrictEqual(status.path, ['name'])
        assert.strictEqual(typeof status.stack[0], 'function')

        return `${user.firstName} ${user.lastName}`
      },
    })(context)

    assert.deepStrictEqual(u.result, [
      {
        firstName: 'Dave',
        lastName: 'L.',
        name: 'Dave L.',
      },
      {
        firstName: 'Fred',
        lastName: 'F.',
        name: 'Fred F.',
      },
    ])
  })

  it('array result on find', async () => {
    const context = {
      method: 'find',
      result: [
        {
          firstName: 'Dave',
          lastName: 'L.',
        },
        {
          firstName: 'Fred',
          lastName: 'F.',
        },
      ],
    } as unknown as HookContext

    const u = await resolveResult<User>({
      password: async (): Promise<undefined> => undefined,

      name: async (_value, user, ctx, status) => {
        assert.deepStrictEqual(ctx, context)
        assert.deepStrictEqual(status.path, ['name'])
        assert.strictEqual(typeof status.stack[0], 'function')

        return `${user.firstName} ${user.lastName}`
      },
    })(context)

    assert.deepStrictEqual(u.result, [
      {
        firstName: 'Dave',
        lastName: 'L.',
        name: 'Dave L.',
      },
      {
        firstName: 'Fred',
        lastName: 'F.',
        name: 'Fred F.',
      },
    ])
  })

  it('paginated result', async () => {
    const context = {
      method: 'find',
      result: {
        data: [
          {
            firstName: 'Dave',
            lastName: 'L.',
          },
          {
            firstName: 'Fred',
            lastName: 'F.',
          },
        ],
      },
    } as unknown as HookContext

    const u = await resolveResult<User>({
      password: async (): Promise<undefined> => undefined,

      name: async (_value, user, ctx, status) => {
        assert.deepStrictEqual(ctx, context)
        assert.deepStrictEqual(status.path, ['name'])
        assert.strictEqual(typeof status.stack[0], 'function')

        return `${user.firstName} ${user.lastName}`
      },
    })(context)

    assert.deepStrictEqual(u.result.data, [
      {
        firstName: 'Dave',
        lastName: 'L.',
        name: 'Dave L.',
      },
      {
        firstName: 'Fred',
        lastName: 'F.',
        name: 'Fred F.',
      },
    ])
  })

  it('resolving with errors', async () => {
    const resolver = resolveResult<{ name: string; age: number }>({
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
    })

    await assert.rejects(
      () =>
        resolver({
          result: {
            name: 'Dave',
            age: 16,
          },
        } as HookContext),
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
    const result = { message: 'Hello' }
    const resolved = await resolveResult({})({ result } as HookContext)

    assert.strictEqual(result, resolved.result)
  })
})
