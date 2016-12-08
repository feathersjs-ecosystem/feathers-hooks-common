if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import { $client } from '../src/new';

describe('$client', () => {
  describe('basics', () => {
    it('works no params', () => {
      const hook = {};
      const hook1 = $client('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {});
    });

    it('works no query', () => {
      const hook = { params: {} };
      const hook1 = $client('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {} });
    });

    it('works no $client', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b'
        }
      } };
      const hook1 = $client('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b'
        }
      } });
    });

    it('leaves hook unchanged if $client not an object', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: 'z'
        }
      } };

      const hook1 = $client('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: 'z'
        }
      } });
    });
  });

  describe('copies client params', () => {
    it('works no whitelisted params', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: { populate: 'aa', serialize: 'bb' }
        }
      } };

      const hook1 = $client()(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b'
        }
      } });
    });

    it('copies whitelisted params', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: { populate: 'aa', serialize: 'bb' }
        }
      } };

      const hook1 = $client('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b'
        },
        populate: 'aa',
        serialize: 'bb'
      } });
    });

    it('copies whitelisted params even if some missing', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: { populate: 'aa', serialize: 'bb' }
        }
      } };

      const hook1 = $client('a', 'populate', 'b', 'serialize', 'q', 'r')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b'
        },
        populate: 'aa',
        serialize: 'bb'
      } });
    });

    it('copies only whitelisted params', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: { populate: 'aa', serialize: 'bb' }
        }
      } };

      const hook1 = $client('populate')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a',
          dept: 'b'
        },
        populate: 'aa'
      } });
    });

    it('copies only whitelisted params even if none', () => {
      const hook = { params: {
        query: {
          div: 'a',
          dept: 'b',
          $client: { populate: 'aa', serialize: 'bb' }
        }
      } };

      const hook1 = $client('q', 'q')(hook);

      assert.deepEqual(hook1, { params: {
        query: {
          div: 'a', dept: 'b'
        }
      } });
    });
  });

  describe('reserved prop names', () => {
    it('throws on reserved names', () => {
      const hook = { params: { query: {} } };

      assert.throws(() => {
        $client('authenticated')(hook);
      });

      assert.throws(() => {
        $client('__authenticated')(hook);
      });

      assert.throws(() => {
        $client('mongoose')(hook);
      });

      assert.throws(() => {
        $client('provider')(hook);
      });

      assert.throws(() => {
        $client('sequelize')(hook);
      });

      assert.throws(() => {
        $client('query')(hook);
      });

      assert.throws(() => {
        $client(
          'app', 'authenticated', '__authenticated',
          'permitted', '__permitted', 'provider', 'query'
        )(hook);
      });
    });
  });
});
