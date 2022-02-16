
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'paramsFrom... Remove this comment to see the full error message
  paramsFromClient
} = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services params-from-client', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('basics', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works no params', () => {
      const hook = {};
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, {});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works no query', () => {
      const hook = { params: {} };
      const hook1 = paramsFromClient('populate', 'serialize')(hook);

      assert.deepEqual(hook1, { params: {} });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('copies client params', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
