
const {
  assert
} = require('chai');

const {
  thenifyHook
} = require('../../lib/services');

let app = { a: 'a' };
let params = { p: 'p' };
let service = { s: 's' };
let thenify;
let hook;

const testHook = hook1 => {
  hook = hook1;

  hook1._called = 'called';
  return hook1;
};

describe('services thenifyHook', () => {
  beforeEach(() => {
    thenify = thenifyHook({ app, params, service });
  });

  it('get expected hook & object result', () => {
    const data = { name: 'john' };

    return Promise.resolve(data)
        .then(thenify(testHook))
        .then(result => {
          assert.deepEqual(result, data, 'test result');
          assert.deepEqual(hook, {
            app, params, service, _called: 'called', result: data, type: 'after'
          }, 'test hook');
        });
  });

  it('get expected array result', () => {
    const data = [{ name: 'john' }];

    return Promise.resolve(data)
      .then(thenify(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });

  it('get expected find result', () => {
    const data = { total: 1, data: [{ name: 'john' }] };

    return Promise.resolve(data)
      .then(thenify(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });
});
