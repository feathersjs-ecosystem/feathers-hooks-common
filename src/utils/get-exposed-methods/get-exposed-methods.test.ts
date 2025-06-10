import { feathers } from '@feathersjs/feathers'
import { MemoryService } from '@feathersjs/memory'
import { getExposedMethods } from './get-exposed-methods.js'

describe('getExposedMethods', () => {
  it('returns an array of exposed methods', () => {
    const app = feathers().use('/test', new MemoryService({}))

    expect(getExposedMethods(app.service('test'))).toEqual([
      'find',
      'get',
      'create',
      'update',
      'patch',
      'remove',
    ])
  })

  it('returns an empty array if no methods are exposed', () => {
    const app = feathers().use('/test', new MemoryService({}), { methods: [] })
    expect(getExposedMethods(app.service('test'))).toEqual([])
  })

  it('returns default methods if no custom methods are provided', () => {
    const app = feathers().use('/test', new MemoryService({}), { methods: ['find', 'get'] })
    expect(getExposedMethods(app.service('test'))).toEqual(['find', 'get'])
  })

  it('returns custom methods', () => {
    const service = new MemoryService({})
    // @ts-expect-error to allow custom methods
    service.customMethod1 = () => {}
    // @ts-expect-error to allow custom methods
    service.customMethod2 = () => {}

    const app = feathers().use('/test', service, {
      methods: ['find', 'customMethod1', 'customMethod2'],
    })
    expect(getExposedMethods(app.service('test'))).toEqual([
      'find',
      'customMethod1',
      'customMethod2',
    ])
  })
})
