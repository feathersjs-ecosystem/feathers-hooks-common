/* eslint-disable @typescript-eslint/no-this-alias */
import type { HookContext } from '@feathersjs/feathers'
import { assert } from 'vitest'
import { iffElse } from './iff-else.js'
import { some } from '../../predicates/some/some.js'
import { every } from '../../predicates/every/every.js'
import { clone } from '../../common/index.js'

let hook: any
let hookBefore: any
let hookAfter: any
let hookFcnSyncCalls: any
let hookFcnAsyncCalls: any
let hookFcnCalls: any
let predicateParam1: any
let predicateParam2: any
let predicateParam3: any
let predicateParam4: any
let context: any
let predicateTrueContext: any
let hookFcnSyncContext: any
let hookFcnAsyncContext: any
let hookFcnContext: any

const hookFcnSync = function (this: any, hook: any) {
  hookFcnSyncContext = this

  hookFcnSyncCalls = +1
  hook.data.first = hook.data.first.toLowerCase()

  return hook
}

const hookFcnAsync = function (this: any, hook: any) {
  hookFcnAsyncContext = this

  return new Promise<HookContext>(resolve => {
    hookFcnAsyncCalls = +1
    hook.data.first = hook.data.first.toLowerCase()

    resolve(hook)
  })
}

const hookFcn = function (this: any, hook: any, _cb: any) {
  hookFcnContext = this

  hookFcnCalls = +1

  return hook
}

const predicateTrue = function (this: any, hook: any, more2: any, more3: any, more4: any): true {
  predicateTrueContext = this

  predicateParam1 = hook
  predicateParam2 = more2
  predicateParam3 = more3
  predicateParam4 = more4

  return true
}

describe('services iffElse', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } }
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } }
    hook = clone(hookBefore)
    hookFcnSyncCalls = 0
    hookFcnAsyncCalls = 0
  })

  describe('runs single hook', () => {
    it('when true', () => {
      return iffElse(
        true,
        hookFcnSync,
        hookFcnAsync,
      )(hook).then((hook: any) => {
        assert.deepEqual(hook, hookAfter)
        assert.equal(hookFcnSyncCalls, 1)
        assert.equal(hookFcnAsyncCalls, 0)
        assert.deepEqual(hook, hookAfter)
      })
    })

    it('when false', () => {
      return iffElse(
        false,
        hookFcnSync,
        hookFcnAsync,
      )(hook).then((hook: any) => {
        assert.deepEqual(hook, hookAfter)
        assert.equal(hookFcnSyncCalls, 0)
        assert.equal(hookFcnAsyncCalls, 1)
        assert.deepEqual(hook, hookAfter)
      })
    })
  })

  describe('runs multiple hooks', () => {
    it('when true', () => {
      return iffElse(
        true,
        // @ts-expect-error TODO
        [hookFcnSync, hookFcnAsync, hookFcn],
        null,
      )(hook).then((hook: any) => {
        assert.deepEqual(hook, hookAfter)
        assert.equal(hookFcnSyncCalls, 1)
        assert.equal(hookFcnAsyncCalls, 1)
        assert.equal(hookFcnCalls, 1)
        assert.deepEqual(hook, hookAfter)
      })
    })

    it('when false', () => {
      return (
        // @ts-expect-error TODO
        iffElse(false, null, [hookFcnSync, hookFcnAsync, hookFcn])(hook).then((hook: any) => {
          assert.deepEqual(hook, hookAfter)
          assert.equal(hookFcnSyncCalls, 1)
          assert.equal(hookFcnAsyncCalls, 1)
          assert.equal(hookFcnCalls, 1)
          assert.deepEqual(hook, hookAfter)
        })
      )
    })
  })

  describe('predicate gets right params', () => {
    it('when true', () => {
      return iffElse(
        // @ts-expect-error TODO
        predicateTrue,
        [hookFcnSync, hookFcnAsync, hookFcn],
        null,
      )(hook).then(() => {
        assert.deepEqual(predicateParam1, hook, 'param1')
        assert.strictEqual(predicateParam2, undefined, 'param2')
        assert.strictEqual(predicateParam3, undefined, 'param3')
        assert.strictEqual(predicateParam4, undefined, 'param4')
      })
    })

    it('every passes on correct params', () => {
      return iffElse(
        // @ts-expect-error TODO
        every(predicateTrue),
        // @ts-expect-error TODO
        [hookFcnSync, hookFcnAsync, hookFcn],
        null,
      )(hook).then(() => {
        assert.deepEqual(predicateParam1, hook, 'param1')
        assert.strictEqual(predicateParam2, undefined, 'param2')
        assert.strictEqual(predicateParam3, undefined, 'param3')
        assert.strictEqual(predicateParam4, undefined, 'param4')
      })
    })

    it('some passes on correct params', () => {
      return iffElse(
        // @ts-expect-error TODO
        some(predicateTrue),
        // @ts-expect-error TODO
        [hookFcnSync, hookFcnAsync, hookFcn],
        null,
      )(hook).then(() => {
        assert.deepEqual(predicateParam1, hook, 'param1')
        assert.strictEqual(predicateParam2, undefined, 'param2')
        assert.strictEqual(predicateParam3, undefined, 'param3')
        assert.strictEqual(predicateParam4, undefined, 'param4')
      })
    })
  })

  describe('predicate and hooks get right context', () => {
    beforeEach(() => {
      context = { service: 'abc' }
      predicateTrueContext = undefined
      hookFcnSyncContext = undefined
      hookFcnAsyncContext = undefined
      hookFcnContext = undefined
    })

    it('services', () => {
      return (
        // @ts-expect-error TODO
        iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcn], null)
          .call(context, hook)
          .then((hook: any) => {
            assert.deepEqual(hook, hookAfter)
            assert.equal(hookFcnSyncCalls, 1)
            assert.equal(hookFcnAsyncCalls, 1)
            assert.equal(hookFcnCalls, 1)
            assert.deepEqual(hook, hookAfter)

            assert.deepEqual(predicateTrueContext, { service: 'abc' })
            assert.deepEqual(hookFcnSyncContext, { service: 'abc' })
            assert.deepEqual(hookFcnAsyncContext, { service: 'abc' })
            assert.deepEqual(hookFcnContext, { service: 'abc' })
          })
      )
    })
  })
})
