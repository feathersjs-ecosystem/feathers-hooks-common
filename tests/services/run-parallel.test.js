const { assert } = require('chai');
const clone = require('clone');
const { runParallel } = require('../../lib/services');

let contextBefore;
let that;

function test (tester) {
  return function (contextCloned) {
    that = this;
    tester(contextCloned);
  };
}

describe('services runParallel', () => {
  beforeEach(() => {
    that = undefined;

    contextBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { first: 'John', last: 'Doe' }
    };
  });

  it('runs the func', done => {
    runParallel(test(tester), clone, 0)(contextBefore);

    function tester () {
      done();
    }
  });

  it('passes this', done => {
    runParallel(test(tester), clone, 0).call({ bar: true }, contextBefore);

    function tester () {
      assert.strictEqual(that.bar, true);
      done();
    }
  });

  it('defaults to uncloned context', done => {
    runParallel(test(tester), clone, 0)(contextBefore);
    contextBefore._foo = true;

    function tester (contextCloned) {
      assert.property(contextCloned, '_foo');
      done();
    }
  });

  it('clones', done => {
    runParallel(test(tester), clone)(contextBefore);
    contextBefore._foo = true;

    function tester (contextCloned) {
      assert.notProperty(contextCloned, '_foo');
      done();
    }
  });

  it('Throws if no func', () => {
    assert.throws(() => {
      runParallel()(contextBefore);
    });
  });
});
