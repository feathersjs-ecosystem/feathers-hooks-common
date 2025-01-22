import { assert } from 'vitest';
import { feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { some } from './some';
import { iff } from '../../hooks/iff/iff';
import { isNot } from '../is-not/is-not';

describe('util some', () => {
  let app: any;

  beforeEach(() => {
    app = feathers().use('/users', new MemoryService());
  });

  describe('when at least 1 hook is truthy', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              some(
                (_hook: any) => false,
                (_hook: any) => Promise.resolve(false),
                (_hook: any) => Promise.resolve(true),
                (_hook: any) => true,
                // @ts-ignore
                (_hook: any) => 1,
                (_hook: any) => {},
              ),
              (hook: any) => Promise.resolve(hook),
            ),
          ],
        },
      });
    });

    it('returns true', () => {
      return app
        .service('users')
        .find()
        .then((result: any) => {
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
              some(
                (_hook: any) => true,
                (_hook: any) => {
                  throw new Error('Hook 2 errored');
                },
                (_hook: any) => true,
              ),
              (hook: any) => Promise.resolve(hook),
            ),
          ],
        },
      });
    });

    it('rejects with the error', () => {
      return app
        .service('users')
        .find()
        .catch((error: any) => {
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
              some(
                (_hook: any) => true,
                (_hook: any) => Promise.reject(Error('Hook 2 errored')),
                (_hook: any) => true,
              ),
              (hook: any) => Promise.resolve(hook),
            ),
          ],
        },
      });
    });

    it('rejects with the error', () => {
      return app
        .service('users')
        .find()
        .catch((error: any) => {
          assert.equal(error.message, 'Hook 2 errored');
        });
    });
  });

  describe('when all hooks are falsey', () => {
    beforeEach(() => {
      app.service('users').hooks({
        before: {
          all: [
            iff(
              isNot(
                some(
                  (_hook: any) => false,
                  (_hook: any) => Promise.resolve(false),
                  // @ts-ignore
                  (_hook: any) => null,
                  (_hook: any) => undefined,
                  // @ts-ignore
                  (_hook: any) => 0,
                ),
              ),
              () => Promise.reject(new Error('All hooks returned false')),
            ),
          ],
        },
      });
    });

    it('returns false', () => {
      return app
        .service('users')
        .find()
        .catch((error: any) => {
          assert.equal(error.message, 'All hooks returned false');
        });
    });
  });
});
