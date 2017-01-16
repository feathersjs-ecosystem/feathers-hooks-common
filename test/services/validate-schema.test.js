
import { assert } from 'chai';
import { validateSchema } from '../../src/services';
import Ajv from 'ajv';

describe('services validateSchema', () => {
  let hookBefore;
  let hookBeforeArray;
  let schema;

  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { first: 'John', last: 'Doe' }
    };
    hookBeforeArray = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
        { first: 'Joe', last: 'Doe' }
      ]
    };
    schema = {
      'properties': {
        'first': { 'type': 'string' },
        'last': { 'type': 'string' }
      },
      'required': ['first', 'last']
    };
  });

  it('works with valid single item', () => {
    validateSchema(schema, Ajv)(hookBefore);
  });

  it('works with array of valid items', () => {
    validateSchema(schema, Ajv)(hookBeforeArray);
  });

  it('fails with in valid single item', () => {
    hookBefore.data = { first: 1 };

    try {
      validateSchema(schema, Ajv)(hookBefore);
      assert.fail(true, false, 'test succeeds unexpectedly');
    } catch (err) {
      assert.deepEqual(err.errors, [
        '\'first\' should be string',
        'should have required property \'last\''
      ]);
    }
  });

  it('fails with array of invalid items', () => {
    hookBeforeArray.data[0] = { first: 1 };
    delete hookBeforeArray.data[2].last;

    try {
      validateSchema(schema, Ajv)(hookBeforeArray);
      assert.fail(true, false, 'test succeeds unexpectedly');
    } catch (err) {
      assert.deepEqual(err.errors, [
        "'in row 1 of 3, first' should be string",
        "in row 1 of 3, should have required property 'last'",
        "in row 3 of 3, should have required property 'last'"
      ]);
    }
  });
});
