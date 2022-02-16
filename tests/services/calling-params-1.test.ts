
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callingPar... Remove this comment to see the full error message
const { callingParamsDefaults, callingParams } = require('../../lib');

let context1: any, context2: any, context3: any, context4: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('service calling-params-1.test.js', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('has defaults', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context1 = { params: { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } };
      context2 = { params: { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true } };
      context3 = { params: { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: undefined } };
      context4 = { params: { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: null } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('standard defaults', () => {
      const res = callingParams()(context1);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores missing', () => {
      const res = callingParams()(context2);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores undefined', () => {
      const res = callingParams()(context3);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not ignore null', () => {
      const res = callingParams()(context4);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: null });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('can reset defaults', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context1 = { params: { query: { aaa: 'bbb' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' } };

      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      callingParamsDefaults(['provider', 'authenticated', 'user'], {});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('check reset to standard defaults', () => {
      const res = callingParams()(context1);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: 'socketio' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('change default propNames', () => {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      callingParamsDefaults(['foo', 'user.name', 'query.aaa']);
      const res = callingParams()(context1);
      assert.deepEqual(res, { foo: 'bar', user: { name: 'Matt' }, query: { aaa: 'bbb' } });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('change default props', () => {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
      callingParamsDefaults(null, { bar: 'foo' });
      const res = callingParams()(context1);
      assert.deepEqual(res, { user: { name: 'Matt' }, authenticated: true, provider: 'socketio', bar: 'foo' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('change both defaults', () => {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      callingParamsDefaults(['foo', 'user.name', 'query.aaa'], { bar: 'foo', qqq: 'rrr' });
      const res = callingParams()(context1);
      assert.deepEqual(res, { foo: 'bar', user: { name: 'Matt' }, query: { aaa: 'bbb' }, bar: 'foo', qqq: 'rrr' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('can call', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context1 = {
        params: { query: { aa: 'a1', bb: 'b1' }, foo: 'bar', baz: 'faz', user: { name: 'Matt' }, authenticated: true, provider: 'socketio' }
      };

      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      callingParamsDefaults(['provider', 'authenticated', 'user'], {});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('default call made by common hooks', () => {
      const res = callingParams()(context1);
      assert.deepEqual(res, {
        authenticated: true, provider: 'socketio', user: { name: 'Matt' }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('with query', () => {
      const res = callingParams({
        query: { id: 1 }
      })(context1);
      assert.deepEqual(res, {
        authenticated: true, provider: 'socketio', user: { name: 'Matt' }, query: { id: 1 }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('with propNames', () => {
      const res = callingParams({
        propNames: ['foo', 'baz', 'query.aa', 'query.cc']
      })(context1);
      assert.deepEqual(res, {
        authenticated: true, provider: 'socketio', user: { name: 'Matt' }, foo: 'bar', baz: 'faz', query: { aa: 'a1' }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disable 1 hook', () => {
      const res = callingParams({
        hooksToDisable: ['populate']
      })(context1);
      assert.deepEqual(res, {
        authenticated: true, provider: 'socketio', user: { name: 'Matt' }, _populate: 'skip'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('disable multiple hooks', () => {
      const res = callingParams({
        hooksToDisable: ['populate', 'fastJoin', 'softDelete', 'stashBefore']
      })(context1);
      assert.deepEqual(res, {
        authenticated: true,
        provider: 'socketio',
        user: { name: 'Matt' },
        _populate: 'skip',
        disableStashBefore: true,
        query: { $disableSoftDelete: true }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignore defaults', () => {
      let res = callingParams({
        ignoreDefaults: true
      })(context1);
      assert.deepEqual(res, {});

      res = callingParams({
        propNames: ['foo', 'baz', 'query.aa', 'query.cc'],
        ignoreDefaults: true
      })(context1);
      assert.deepEqual(res, {
        foo: 'bar', baz: 'faz', query: { aa: 'a1' }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('with multiple options', () => {
      const res = callingParams({
        query: { id: 1 },
        propNames: ['foo', 'baz', 'query.aa', 'query.cc'],
        hooksToDisable: ['populate', 'fastJoin', 'softDelete', 'stashBefore']
      })(context1);
      assert.deepEqual(res, {
        disableStashBefore: true,
        query: { id: 1, aa: 'a1', $disableSoftDelete: true },
        foo: 'bar',
        baz: 'faz',
        _populate: 'skip',
        user: { name: 'Matt' },
        authenticated: true,
        provider: 'socketio'
      });
    });
  });
});
