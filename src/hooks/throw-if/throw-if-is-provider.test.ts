import type { HookContext } from '@feathersjs/feathers'
import { throwIfIsProvider } from './throw-if-is-provider.js'
import { MethodNotAllowed } from '@feathersjs/errors'

describe('throwIfIsProvider', () => {
  it('should throw if provider matches', async () => {
    const context = {
      method: 'create',
      params: { provider: 'rest' },
    } as HookContext

    await expect(() => throwIfIsProvider(['rest', 'socketio'])(context)).rejects.toThrow(
      MethodNotAllowed,
    )
  })

  it('should not throw on provider mismatch', async () => {
    const context = {
      method: 'create',
      params: { provider: 'rest' },
    } as HookContext
    await expect(throwIfIsProvider(['socketio'])(context)).resolves.not.toThrow()
  })

  it('can use options.filter', async () => {
    const context = {
      method: 'create',
      params: { provider: 'rest' },
    } as HookContext

    await expect(
      throwIfIsProvider(['rest', 'socketio'], {
        filter: ctx => ctx.method === 'find',
      })(context),
    ).resolves.not.toThrow("Provider 'rest' can not call 'create'.")
  })
})
