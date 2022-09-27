import { assert } from 'chai';
import clone from 'clone';
import { runParallel } from '../../src';

let contextBefore: any;
let that: any;

function test(tester: any) {
  return function (this: any, contextCloned: any) {
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
      data: { first: 'John', last: 'Doe' },
    };
  });

  it('runs the func', (done: any) => {
    // @ts-ignore
    runParallel(test(tester), clone, 0)(contextBefore);

    function tester() {
      done();
    }
  });

  it('passes this', (done: any) => {
    // @ts-ignore
    runParallel(test(tester), clone, 0).call({ bar: true }, contextBefore);

    function tester() {
      assert.strictEqual(that.bar, true);
      done();
    }
  });

  it('defaults to uncloned context', (done: any) => {
    // @ts-ignore
    runParallel(test(tester), clone, 0)(contextBefore);
    contextBefore._foo = true;

    function tester(contextCloned: any) {
      assert.property(contextCloned, '_foo');
      done();
    }
  });

  it('clones', (done: any) => {
    runParallel(test(tester), clone)(contextBefore);
    contextBefore._foo = true;

    function tester(contextCloned: any) {
      assert.notProperty(contextCloned, '_foo');
      done();
    }
  });

  it('Throws if no func', () => {
    assert.throws(() => {
      // @ts-expect-error
      runParallel()(contextBefore);
    });
  });
});
