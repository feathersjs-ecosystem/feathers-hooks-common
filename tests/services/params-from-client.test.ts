
const {
  assert
} = require('chai');

const {
  paramsFromClient
} = require('../../lib/services');

describe('services params-from-client', () => {
  describe('basics', () => {
    it('works no params', () => {
      const hook = {};
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {});
    });

    it('works no query', () => {
      const hook = { params: {} };
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {} });
    });

    it('works no $client', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          }
        }
      };
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          }
        }
      });
    });

    it('leaves hook unchanged if $client not an object', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: 'z'
          }
        }
      };

      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: 'z'
          }
        }
      });
    });
  });

  describe('copies client params', () => {
    it('works no whitelisted params', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' }
          }
        }
      };

      const hook1 = paramsFromClient()(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          }
        }
      });
    });

    it('copies whitelisted params', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' }
          }
        }
      };

      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          },
          populate: 'aa',
          serialize: 'bb'
        }
      });
    });

    it('copies whitelisted params even if some missing', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' }
          }
        }
      };

      const hook1 = paramsFromClient('a', 'populate', 'b', 'serialize', 'q', 'r')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          },
          populate: 'aa',
          serialize: 'bb'
        }
      });
    });

    it('copies only whitelisted params', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' }
          }
        }
      };

      const hook1 = paramsFromClient('populate')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b'
          },
          populate: 'aa'
        }
      });
    });

    it('copies only whitelisted params even if none', () => {
      const hook = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' }
          }
        }
      };

      const hook1 = paramsFromClient('q', 'q')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a', dept: 'b'
          }
        }
      });
    });
  });
});
