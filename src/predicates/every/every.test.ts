import { assert } from 'vitest';
import { feathers, HookContext } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import { iff } from '../../hooks';
import { every } from './every';
import { isNot } from '../not/not';

describe('predicates/every', () => {
  it('returns true synchronously when empty', () => {
    assert.equal(every()({} as HookContext), true);
  });

  it('returns false synchronously when at least 1 hook is false', () => {
    expect(
      every(
        () => true,
        () => Promise.resolve(false),
        () => Promise.resolve(true),
        () => false,
      )({} as HookContext),
    ).toBe(false);
  });

  it('returns true when all hooks are truthy', async () => {
    await expect(
      every(
        () => true,
        () => Promise.resolve(true),
        () => Promise.resolve(true),
      )({} as HookContext),
    ).resolves.toBe(true);
  });

  it('rejects with the error', async () => {
    await expect(
      async () => await every(() => Promise.reject(new Error('errored')))({} as HookContext),
    ).rejects.toThrow('errored');
  });

  it('does not run all predicates when one is false', () => {
    let ran = 0;
    const fn = () => {
      ran++;
      return false;
    };

    expect(every(fn, fn, fn)({} as HookContext)).toBe(false);
    expect(ran).toBe(1);
  });

  let app: any;

  beforeEach(() => {
    app = feathers().use('/users', new MemoryService());
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
                (_hook: any) => Promise.resolve(true),
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
              every(
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
              every(
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
                  (_hook: any) => true,
                ),
              ),
              () => Promise.reject(new Error('A hook returned false')),
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
          assert.equal(error.message, 'A hook returned false');
        });
    });
  });
});
