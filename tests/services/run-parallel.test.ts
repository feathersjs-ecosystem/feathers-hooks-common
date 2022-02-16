// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
const clone = require('clone');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'runParalle... Remove this comment to see the full error message
const { runParallel } = require('../../lib/services');

let contextBefore: any;
let that: any;

function test (tester: any) {
  return function(this: any, contextCloned: any) {
    that = this;
    tester(contextCloned);
  };
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services runParallel', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    that = undefined;

    contextBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { first: 'John', last: 'Doe' }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs the func', (done: any) => {
    runParallel(test(tester), clone, 0)(contextBefore);

    function tester () {
      done();
    }
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('passes this', (done: any) => {
    runParallel(test(tester), clone, 0).call({ bar: true }, contextBefore);

    function tester () {
      assert.strictEqual(that.bar, true);
      done();
    }
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('defaults to uncloned context', (done: any) => {
    runParallel(test(tester), clone, 0)(contextBefore);
    contextBefore._foo = true;

    function tester (contextCloned: any) {
      assert.property(contextCloned, '_foo');
      done();
    }
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('clones', (done: any) => {
    runParallel(test(tester), clone)(contextBefore);
    contextBefore._foo = true;

    function tester (contextCloned: any) {
      assert.notProperty(contextCloned, '_foo');
      done();
    }
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Throws if no func', () => {
    assert.throws(() => {
      runParallel()(contextBefore);
    });
  });
});
