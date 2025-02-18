import { assert } from 'vitest';
import { omitData } from './omit-data';

describe('omitData', () => {
  describe('removes fields', () => {
    const beforeJohn = (): any => ({ type: 'before', data: { first: 'John', last: 'Doe' } });
    const beforeUndef = (): any => ({ type: 'before', data: { first: undefined, last: 'Doe' } });
    const beforeNull = (): any => ({ type: 'before', data: { first: null, last: 'Doe' } });

    const decisionTable = [
      ['before::create', beforeJohn(), 'create', null, ['first'], { last: 'Doe' }],
      ['not throw field missing', beforeJohn(), 'create', 'rest', ['first', 'xx'], { last: 'Doe' }],
      ['not throw field undefined', beforeUndef(), 'create', 'rest', ['first'], { last: 'Doe' }],
      ['not throw field null', beforeNull(), 'create', 'rest', ['first'], { last: 'Doe' }],
    ];

    decisionTable.forEach(([desc, context, method, provider, args, result]) => {
      it(desc, () => {
        context.method = method;
        if (provider !== null) {
          context.params = context.params || {};
          context.params.provider = provider;
        }

        omitData(...args)(context);
        assert.deepEqual(
          context.data ? context.data : context.result.data || context.result,
          result,
        );
      });
    });
  });

  describe('handles dot notation', () => {
    const ctx = (): any => ({
      type: 'before',
      method: 'create',
      data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
    });

    const decisionTable = [
      // desc,           context, args,                    result
      [
        'handles dots',
        ctx(),
        ['dept'],
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } },
      ],
      [
        'handle 1 dot',
        ctx(),
        ['empl.status'],
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' },
      ],
      [
        'handle 2 dot',
        ctx(),
        ['empl.name.first'],
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      ],
      [
        'missing path',
        ctx(),
        ['empl.xx.first'],
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      ],
      [
        'missing no dot',
        ctx(),
        ['xx'],
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      ],
      [
        '2 fields',
        ctx(),
        ['empl.status', 'dept'],
        { empl: { name: { first: 'John', last: 'Doe' } } },
      ],
    ];

    decisionTable.forEach(([desc, context, args, result]) => {
      it(desc, () => {
        omitData(...args)(context);
        assert.deepEqual(
          context.data ? context.data : context.result.data || context.result,
          result,
        );
      });
    });
  });
});
