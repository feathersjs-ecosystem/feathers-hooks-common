
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const hooks = require('../../src/hooks');
const permissions = require('../../src/permissions');

describe('permissions some', () => {
  let app;

  beforeEach(() => {
    app = feathers()
      .configure(feathersHooks())
      .use('/users', memory());
  });

  describe('when at least 1 hook is truthy', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff( // must be hooks as permissions will eval to true, false
              permissions.some(
                (hook) => false,
                (hook) => Promise.resolve(false),
                (hook) => Promise.resolve(true),
                (hook) => true,
                (hook) => 1,
                (hook) => {}
              ),
              (hook) => hook
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
              permissions.some(
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
              permissions.some(
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

  describe('when all permissions are falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              permissions.isNot(
                permissions.some(
                  (hook) => false,
                  (hook) => Promise.resolve(false),
                  (hook) => null,
                  (hook) => undefined,
                  (hook) => 0
                )
              ),
              () => Promise.reject(new Error('All permissions returned false'))
            )
          ]
        }
      });
    });

    it('returns false', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'All permissions returned false');
      });
    });
  });
});
