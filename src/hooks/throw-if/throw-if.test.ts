import { BadRequest, GeneralError } from '@feathersjs/errors'
import { throwIf } from './throw-if.js'
import type { HookContext } from '@feathersjs/feathers'

describe('throwIf', () => {
  it('throws BadRequest if no error function is provided', async () => {
    await expect(() => throwIf(() => true)({} as HookContext)).rejects.toThrow(BadRequest)
  })

  it('should throw an error if the predicate returns true', async () => {
    await expect(() =>
      throwIf(() => true, { error: () => new GeneralError('Test error') })({} as HookContext),
    ).rejects.toThrow(GeneralError)
  })

  it('async predicate should throw an error if it returns true', async () => {
    await expect(() =>
      throwIf(async () => true, { error: () => new GeneralError('Async test error') })(
        {} as HookContext,
      ),
    ).rejects.toThrow(GeneralError)
  })
})
