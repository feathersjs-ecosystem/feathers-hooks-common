import { assert } from 'vitest';
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

  it('runs the func', () =>
    new Promise<void>(resolve => {
      runParallel(test(tester))(contextBefore);

      function tester() {
        resolve();
      }
    }));

  it('passes this', () =>
    new Promise<void>(resolve => {
      runParallel(test(tester)).call({ bar: true }, contextBefore);

      function tester() {
        assert.strictEqual(that.bar, true);
        resolve();
      }
    }));

  it('defaults to uncloned context', () =>
    new Promise<void>(resolve => {
      runParallel(test(tester))(contextBefore);
      contextBefore._foo = true;

      function tester(contextCloned: any) {
        assert.property(contextCloned, '_foo');
        resolve();
      }
    }));

  it('clones', () =>
    new Promise<void>(resolve => {
      runParallel(test(tester), structuredClone)(contextBefore);
      contextBefore._foo = true;

      function tester(contextCloned: any) {
        assert.notProperty(contextCloned, '_foo');
        resolve();
      }
    }));

  it('Throws if no func', () => {
    assert.throws(() => {
      // @ts-expect-error
      runParallel()(contextBefore);
    });
  });
});
