
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('chai').assert;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services some', () => {
  let app: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    app = feathers()
      .use('/users', memory());
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when at least 1 hook is truthy', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook: any) => false,
                (hook: any) => Promise.resolve(false),
                (hook: any) => Promise.resolve(true),
                (hook: any) => true,
                (hook: any) => 1,
                (hook: any) => {}
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true', () => {
      return app.service('users').find().then((result: any) => {
        assert.deepEqual(result, []);
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when a hook throws an error', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook: any) => true,
                (hook: any) => {
                  throw new Error('Hook 2 errored');
                },
                (hook: any) => true
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects with the error', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when a hook rejects with an error', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook: any) => true,
                (hook: any) => Promise.reject(Error('Hook 2 errored')),
                (hook: any) => true
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rejects with the error', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when all hooks are falsey', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.isNot(
                hooks.some(
                  (hook: any) => false,
                  (hook: any) => Promise.resolve(false),
                  (hook: any) => null,
                  (hook: any) => undefined,
                  (hook: any) => 0
                )
              ),
              () => Promise.reject(new Error('All hooks returned false'))
            )
          ]
        }
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'All hooks returned false');
      });
    });
  });
});
