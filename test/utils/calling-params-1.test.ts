import { assert } from 'chai';
import { callingParamsDefaults, callingParams } from '../../src';

let context1: any;
let context2: any;
let context3: any;
let context4: any;

describe('util calling-params-1.test.js', () => {
  describe('has defaults', () => {
    beforeEach(() => {
      context1 = {
        params: {
          query: { aaa: 'bbb' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
          provider: 'socketio',
        },
      };
      context2 = {
        params: {
          query: { aaa: 'bbb' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
        },
      };
      context3 = {
        params: {
          query: { aaa: 'bbb' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
          provider: undefined,
        },
      };
      context4 = {
        params: {
          query: { aaa: 'bbb' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
          provider: null,
        },
      };
    });

    it('standard defaults', () => {
      const res = callingParams()(context1);
      // @ts-ignore
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
    });

    it('ignores missing', () => {
      const res = callingParams()(context2);
      // @ts-ignore
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true });
    });

    it('ignores undefined', () => {
      const res = callingParams()(context3);
      // @ts-ignore
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true });
    });

    it('does not ignore null', () => {
      const res = callingParams()(context4);
      // @ts-ignore
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: null });
    });
  });

  describe('can reset defaults', () => {
    beforeEach(() => {
      context1 = {
        params: {
          query: { aaa: 'bbb' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
          provider: 'socketio',
        },
      };

      callingParamsDefaults(['provider', 'authenticated', 'user'], {});
    });

    it('check reset to standard defaults', () => {
      const res = callingParams()(context1);
      // @ts-ignore
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
    });

    it('change default propNames', () => {
      callingParamsDefaults(['foo', 'user.name', 'query.aaa']);
      const res = callingParams()(context1);
      // @ts-ignore
      assert.deepEqual(res, { foo: 'bar', user: { name: 'Matt' }, query: { aaa: 'bbb' } });
    });

    it('change default props', () => {
      // @ts-ignore
      callingParamsDefaults(null, { bar: 'foo' });
      const res = callingParams()(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        user: { name: 'Matt' },
        authenticated: true,
        provider: 'socketio',
        bar: 'foo',
      });
    });

    it('change both defaults', () => {
      callingParamsDefaults(['foo', 'user.name', 'query.aaa'], { bar: 'foo', qqq: 'rrr' });
      const res = callingParams()(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        foo: 'bar',
        user: { name: 'Matt' },
        query: { aaa: 'bbb' },
        bar: 'foo',
        qqq: 'rrr',
      });
    });
  });

  describe('can call', () => {
    beforeEach(() => {
      context1 = {
        params: {
          query: { aa: 'a1', bb: 'b1' },
          foo: 'bar',
          baz: 'faz',
          user: { name: 'Matt' },
          authenticated: true,
          provider: 'socketio',
        },
      };

      callingParamsDefaults(['provider', 'authenticated', 'user'], {});
    });

    it('default call made by common hooks', () => {
      const res = callingParams()(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
      });
    });

    it('with query', () => {
      const res = callingParams({
        query: { id: 1 },
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
        query: { id: 1 },
      });
    });

    it('with propNames', () => {
      const res = callingParams({
        propNames: ['foo', 'baz', 'query.aa', 'query.cc'],
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
        foo: 'bar',
        baz: 'faz',
        query: { aa: 'a1' },
      });
    });

    it('disable 1 hook', () => {
      const res = callingParams({
        hooksToDisable: ['populate'],
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
        _populate: 'skip',
      });
    });

    it('disable multiple hooks', () => {
      const res = callingParams({
        hooksToDisable: ['populate', 'fastJoin', 'softDelete', 'stashBefore'],
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
        _populate: 'skip',
        disableStashBefore: true,
        query: { $disableSoftDelete: true },
      });
    });

    it('ignore defaults', () => {
      let res = callingParams({
        ignoreDefaults: true,
      })(context1);
      assert.deepEqual(res, {});

      res = callingParams({
        propNames: ['foo', 'baz', 'query.aa', 'query.cc'],
        ignoreDefaults: true,
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        foo: 'bar',
        baz: 'faz',
        query: { aa: 'a1' },
      });
    });

    it('with multiple options', () => {
      const res = callingParams({
        query: { id: 1 },
        propNames: ['foo', 'baz', 'query.aa', 'query.cc'],
        hooksToDisable: ['populate', 'fastJoin', 'softDelete', 'stashBefore'],
      })(context1);
      assert.deepEqual(res, {
        // @ts-ignore
        disableStashBefore: true,
        query: { id: 1, aa: 'a1', $disableSoftDelete: true },
        foo: 'bar',
        baz: 'faz',
        _populate: 'skip',
        user: { name: 'Matt' },
        authenticated: true,
        provider: 'socketio',
      });
    });
  });
});
