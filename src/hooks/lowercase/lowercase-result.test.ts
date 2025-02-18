import { assert } from 'vitest';
import { lowercaseResult } from './lowercase-result';
import { HookContext } from '@feathersjs/feathers';

describe('lowercaseResult', () => {
  it('updates hook after::find with pagination', () => {
    const context = {
      type: 'after',
      method: 'find',
      result: {
        total: 2,
        data: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      },
    } as HookContext;

    lowercaseResult(['first', 'last'])(context);
    assert.deepEqual(context.result.data, [
      { first: 'john', last: 'doe' },
      { first: 'jane', last: 'doe' },
    ]);
  });

  it('updates hook after::find with no pagination', () => {
    const context = {
      type: 'after',
      method: 'find',
      result: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    } as HookContext;
    lowercaseResult(['first', 'last'])(context);
    assert.deepEqual(context.result, [
      { first: 'john', last: 'doe' },
      { first: 'jane', last: 'doe' },
    ]);
  });

  it('updates hook after', () => {
    const context = {
      type: 'after',
      method: 'create',
      result: { first: 'Jane', last: 'Doe' },
    } as HookContext;
    lowercaseResult(['first', 'last'])(context);

    assert.deepEqual(context.result, { first: 'jane', last: 'doe' });
  });
});
