import type { HookContext } from '@feathersjs/feathers'
import { isPaginated } from './is-paginated.js'

describe('predicates/isPaginated', () => {
  it('returns true for service.options.paginate', function () {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50,
      },
    }

    const paginate = isPaginated({
      params: {},
      service: {
        options: serviceOptions,
      },
      method: 'find',
    } as HookContext)

    assert.deepStrictEqual(paginate, true)
  })

  it('returns false for params.paginate: false', function () {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50,
      },
    }

    const paginate = isPaginated({
      params: { paginate: false },
      service: {
        options: serviceOptions,
      },
    } as HookContext)

    assert.deepStrictEqual(paginate, false)
  })

  it('returns true for context.adapter.paginate', function () {
    const serviceOptions = {
      paginate: false,
    }

    const paginate = isPaginated({
      params: { adapter: { paginate: { default: 20, max: 100 } } },
      service: {
        options: serviceOptions,
      },
      method: 'find',
    } as HookContext)

    assert.deepStrictEqual(paginate, true)
  })

  it('returns false for no paginate', function () {
    const serviceOptions = {
      paginate: false,
    }

    const paginate = isPaginated({
      params: {},
      service: {
        options: serviceOptions,
      },
    } as HookContext)

    assert.deepStrictEqual(paginate, false)
  })
})
