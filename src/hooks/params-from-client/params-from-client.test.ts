import { assert } from 'vitest';
import { paramsFromClient } from './params-from-client';

describe('services params-from-client', () => {
  describe('basics', () => {
    it('works no params', () => {
      const hook: any = {};
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {} as any);
    });

    it('works no query', () => {
      const hook: any = { params: {} };
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {} } as any);
    });

    it('works no $client', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
        },
      };
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
        },
      } as any);
    });

    it('leaves hook unchanged if $client not an object', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: 'z',
          },
        },
      };

      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: 'z',
          },
        },
      } as any);
    });
  });

  describe('copies client params', () => {
    it('works no whitelisted params', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' },
          },
        },
      };

      const hook1 = paramsFromClient()(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
        },
      } as any);
    });

    it('copies whitelisted params', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' },
          },
        },
      };

      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
          populate: 'aa',
          serialize: 'bb',
        },
      } as any);
    });

    it('copies whitelisted params even if some missing', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' },
          },
        },
      };

      const hook1 = paramsFromClient('a', 'populate', 'b', 'serialize', 'q', 'r')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
          populate: 'aa',
          serialize: 'bb',
        },
      } as any);
    });

    it('copies only whitelisted params', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' },
          },
        },
      };

      const hook1 = paramsFromClient('populate')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
          populate: 'aa',
        },
      } as any);
    });

    it('copies only whitelisted params even if none', () => {
      const hook: any = {
        params: {
          query: {
            div: 'a',
            dept: 'b',
            $client: { populate: 'aa', serialize: 'bb' },
          },
        },
      };

      const hook1 = paramsFromClient('q', 'q')(hook);

      assert.deepEqual(hook1, {
        params: {
          query: {
            div: 'a',
            dept: 'b',
          },
        },
      } as any);
    });
  });
});
