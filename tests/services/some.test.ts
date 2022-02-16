
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const hooks = require('../../lib/services');

describe('services some', () => {
  let app;

  beforeEach(() => {
    app = feathers()
      .use('/users', memory());
  });

  describe('when at least 1 hook is truthy', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook) => false,
                (hook) => Promise.resolve(false),
                (hook) => Promise.resolve(true),
                (hook) => true,
                (hook) => 1,
                (hook) => {}
              ),
              (hook) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('returns true', () => {
      return app.service('users').find().then(result => {
        assert.deepEqual(result, []);
      });
    });
  });

  describe('when a hook throws an error', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook) => true,
                (hook) => {
                  throw new Error('Hook 2 errored');
                },
                (hook) => true
              ),
              (hook) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('rejects with the error', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  describe('when a hook rejects with an error', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.some(
                (hook) => true,
                (hook) => Promise.reject(Error('Hook 2 errored')),
                (hook) => true
              ),
              (hook) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('rejects with the error', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  describe('when all hooks are falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.isNot(
                hooks.some(
                  (hook) => false,
                  (hook) => Promise.resolve(false),
                  (hook) => null,
                  (hook) => undefined,
                  (hook) => 0
                )
              ),
              () => Promise.reject(new Error('All hooks returned false'))
            )
          ]
        }
      });
    });

    it('returns false', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'All hooks returned false');
      });
    });
  });
});
