import { assert, expect } from 'vitest';
import { HookContext } from '@feathersjs/feathers';
import { some } from './some';

describe('predicates/some', () => {
  it('returns true synchronously when empty', () => {
    expect(some()({} as HookContext)).toBe(true);
  });

  it('returns true synchronously when at least 1 hook is true', () => {
    expect(
      some(
        () => false,
        () => false,
        () => Promise.resolve(false),
        () => Promise.resolve(true),
        () => true,
      )({} as HookContext),
    ).toBe(true);
  });

  it('returns true when at least 1 async hook is true', async () => {
    expect(
      some(
        () => false,
        () => Promise.resolve(false),
        () => Promise.resolve(true),
      )({} as HookContext),
    ).resolves.toBe(true);
  });

  it('rejects with the error', async () => {
    await expect(
      async () => await some(() => Promise.reject(new Error('errored')))({} as HookContext),
    ).rejects.toThrow('errored');
  });

  it('does not run all predicates when one is true', () => {
    let ran = 0;
    const fn = () => {
      ran++;
      return true;
    };

    expect(some(fn, fn, fn)({} as HookContext)).toBe(true);
    expect(ran).toBe(1);
  });

  it('when all hooks are falsey', async () => {
    await expect(
      some(
        () => false,
        () => Promise.resolve(false),
        // @ts-expect-error test case
        () => null,
        () => undefined,
        () => 0,
      )({} as HookContext),
    ).resolves.toBe(false);
  });
});
