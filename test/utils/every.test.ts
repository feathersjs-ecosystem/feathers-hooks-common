import { assert } from 'chai';
import { feathers } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { iff, every, isNot } from '../../src';

describe('util every', () => {
  let app: any;

  beforeEach(() => {
    app = feathers()
      .use('/users', memory());
  });

  describe('when all hooks are truthy', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              every(
                (_hook: any) => true,
                // @ts-ignore
                (_hook: any) => 1,
                (_hook: any) => {},
                (_hook: any) => Promise.resolve(true)
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('returns true', () => {
      return app.service('users').find().then((result: any) => {
        assert.deepEqual(result, []);
      });
    });
  });

  describe('when a hook throws an error', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              every(
                (_hook: any) => true,
                (_hook: any) => {
                  throw new Error('Hook 2 errored');
                },
                (_hook: any) => true
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('rejects with the error', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  describe('when a hook rejects with an error', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              every(
                (_hook: any) => true,
                (_hook: any) => Promise.reject(Error('Hook 2 errored')),
                (_hook: any) => true
              ),
              (hook: any) => Promise.resolve(hook)
            )
          ]
        }
      });
    });

    it('rejects with the error', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'Hook 2 errored');
      });
    });
  });

  describe('when at least one hook is falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              isNot(
                every(
                  (_hook: any) => true,
                  (_hook: any) => Promise.resolve(true),
                  (_hook: any) => Promise.resolve(false),
                  (_hook: any) => false,
                  // @ts-ignore
                  (_hook: any) => 0,
                  (_hook: any) => null,
                  (_hook: any) => undefined,
                  (_hook: any) => true
                )
              ),
              () => Promise.reject(new Error('A hook returned false'))
            )
          ]
        }
      });
    });

    it('returns false', () => {
      return app.service('users').find().catch((error: any) => {
        assert.equal(error.message, 'A hook returned false');
      });
    });
  });
});
