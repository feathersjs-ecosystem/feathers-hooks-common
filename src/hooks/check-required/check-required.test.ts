import { assert } from 'vitest';
import { checkRequired } from './check-required';
import { HookContext } from '@feathersjs/feathers';

let hookBefore: HookContext;

describe('checkRequired', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
    } as HookContext;
  });

  it('does 1 prop with no dots', () => {
    checkRequired('empl')(hookBefore);
  });

  it('does multi props with 1 dot', () => {
    checkRequired(['empl.name', 'dept'])(hookBefore);
  });

  it('does multi props with 2 dots', () => {
    checkRequired(['empl.name.last', 'empl.status', 'dept'])(hookBefore);
  });

  it('throws on bad or missing paths', () => {
    assert.throws(() => checkRequired(['empl.name.first', 'empl.name.surname'])(hookBefore));
  });

  it('ignores bad or missing no dot path', () => {
    assert.throws(() => checkRequired('xx')(hookBefore));
  });
});
