import { assert } from 'vitest';
import { omitResult } from './omit-result';

describe('omitResult', () => {
  describe('removes fields', () => {
    const afterJane = (): any => ({ type: 'after', result: { first: 'Jane', last: 'Doe' } });
    const afterBoth = (): any => ({
      type: 'after',
      result: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    });
    const afterPage = (): any => ({
      type: 'after',
      result: {
        total: 2,
        skip: 0,
        data: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      },
    });

    const decisionTable = [
      // desc,                      context,       method,   provider,  args,            result
      [
        'after::find with paginate',
        afterPage(),
        'find',
        undefined,
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      [
        'after::find with paginate',
        afterPage(),
        'find',
        'rest',
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      [
        'after::find with paginate',
        afterPage(),
        'find',
        'socketio',
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      [
        'after::find no paginate',
        afterBoth(),
        'find',
        undefined,
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      [
        'after::find no paginate',
        afterBoth(),
        'find',
        'rest',
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      [
        'after::find no paginate',
        afterBoth(),
        'find',
        'socketio',
        ['last'],
        [{ first: 'John' }, { first: 'Jane' }],
      ],
      ['after', afterJane(), 'create', undefined, ['last'], { first: 'Jane' }],
      ['after', afterJane(), 'create', 'rest', ['last'], { first: 'Jane' }],
      ['after', afterJane(), 'create', 'socketio', ['last'], { first: 'Jane' }],
      ['call internally on server', afterJane(), 'create', undefined, ['last'], { first: 'Jane' }],
    ];

    decisionTable.forEach(([desc, context, method, provider, args, result]) => {
      it(desc, () => {
        context.method = method;
        if (provider !== null) {
          context.params = context.params || {};
          context.params.provider = provider;
        }

        omitResult(...args)(context);
        assert.deepEqual(
          context.data ? context.data : context.result.data || context.result,
          result,
        );
      });
    });
  });

  describe('handles dot notation', () => {
    const ctx2 = (): any => ({
      type: 'after',
      method: 'get',
      result: { property: null, foo: 'bar' },
    });

    const decisionTable = [
      // desc,           context, args,                    result
      ['path not obj', ctx2(), ['property.secret'], { property: null, foo: 'bar' }],
    ];

    decisionTable.forEach(([desc, context, args, result]) => {
      it(desc, () => {
        omitResult(...args)(context);
        assert.deepEqual(
          context.data ? context.data : context.result.data || context.result,
          result,
        );
      });
    });
  });
});
