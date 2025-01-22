import { assert } from 'vitest';
import { getItems } from './get-items';

describe('getItems', () => {
  it('updates hook before::create item', () => {
    assert.deepEqual(
      getItems({
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      } as any),
      { first: 'John', last: 'Doe' },
    );
  });

  it('updates hook before::create items', () => {
    assert.deepEqual(
      getItems({
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      } as any),
      [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    );
  });

  it('updates hook after::create item', () => {
    assert.deepEqual(
      getItems({
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane2', last: 'Doe2' },
      } as any),
      { first: 'Jane2', last: 'Doe2' },
    );
  });

  it('updates hook after::create items', () => {
    assert.deepEqual(
      getItems({
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [
          { first: 'John2', last: 'Doe2' },
          { first: 'Jane', last: 'Doe' },
        ],
      } as any),
      [
        { first: 'John2', last: 'Doe2' },
        { first: 'Jane', last: 'Doe' },
      ],
    );
  });

  it('updates hook after::find item', () => {
    assert.deepEqual(
      getItems({
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { first: 'John3', last: 'Doe3' },
            { first: 'Jane3', last: 'Doe3' },
          ],
        },
      } as any),
      [
        { first: 'John3', last: 'Doe3' },
        { first: 'Jane3', last: 'Doe3' },
      ],
    );
  });

  it('updates hook after::find item paginated', () => {
    assert.deepEqual(
      getItems({
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      } as any),
      [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    );
  });

  it('does not throw on before without data', () => {
    assert.equal(
      getItems({ type: 'before', method: 'create', params: { provider: 'rest' } } as any),
      undefined,
    );
  });

  it('does not throw on after without data', () => {
    assert.equal(
      getItems({ type: 'after', method: 'find', params: { provider: 'rest' } } as any),
      undefined,
    );
  });
});
