
const assert = require('chai').assert;
const feathers = require('feathers');
const memory = require('feathers-memory');
const feathersHooks = require('feathers-hooks');
const hooks = require('../src');

describe('some', () => {
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
            hooks.iff(
              hooks.some(
                (hook) => {
                  throw new Error('Hook 1 errored');
                },
                (hook) => true,
                (hook) => false,
                (hook) => Promise.resolve(true),
                (hook) => Promise.resolve(false),
                (hook) => Promise.reject(new Error('Last Hook errored'))
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

  describe('when at least all hooks are falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            hooks.iff(
              hooks.isNot(
                hooks.some(
                  (hook) => {
                    throw new Error('Hook 1 errored');
                  },
                  (hook) => false,
                  (hook) => Promise.resolve(false),
                  (hook) => Promise.reject(new Error('Last Hook errored'))
                )
              ),
              () => Promise.reject(new Error('Some Failed'))
            )
          ]
        }
      });
    });

    it('returns false', () => {
      return app.service('users').find().catch(error => {
        assert.equal(error.message, 'Some Failed');
      });
    });
  });
});
