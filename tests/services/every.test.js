
const assert = require('chai').assert;
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const hooks = require('../../lib/services');

describe('services every', () => {
  let app;

  beforeEach(() => {
    app = feathers()
      .use('/users', memory());
  });

  describe('when all hooks are truthy', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.every(
                (hook) => true,
                (hook) => 1,
                (hook) => {},
                (hook) => Promise.resolve(true)
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
              hooks.every(
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
              hooks.every(
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

  describe('when at least one hook is falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.isNot(
                hooks.every(
                  (hook) => true,
                  (hook) => Promise.resolve(true),
                  (hook) => Promise.resolve(false),
                  (hook) => false,
                  (hook) => 0,
                  (hook) => null,
                  (hook) => undefined,
                  (hook) => true
                )
              ),
              () => Promise.reject(new Error('A hook returned false'))
            )
          ]
        }
      });
    });

    it('returns false', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'A hook returned false');
      });
    });
  });
});
