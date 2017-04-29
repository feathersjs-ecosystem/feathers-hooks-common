
import { assert } from 'chai';
import { validateSchema } from '../../src/services';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
ajv.addFormat('startWithJo', '^Jo');

describe('services validateSchema', () => {
  let hookBefore;
  let hookBeforeArray;
  let hookBeforeArrayForAjvInstance;
  let schema;
  let schemaForAjvInstance;

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
    hookBeforeArrayForAjvInstance = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: [
        { first: 'John', last: 'Doe' },
        { first: 'Josh', last: 'Doe' },
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
    schemaForAjvInstance = {
      'properties': {
        'first': { 'type': 'string', 'format': 'startWithJo' },
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

  it('works with valid single item when ajv instance is passed', () => {
    validateSchema(schemaForAjvInstance, ajv)(hookBefore);
  });

  it('works with array of valid items when ajv instance is passed', () => {
    validateSchema(schemaForAjvInstance, ajv)(hookBeforeArrayForAjvInstance);
  });

  it('fails with invalid single item', () => {
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

  it('fails with invalid single item when ajv instance is passed', () => {
    hookBefore.data = { first: 'Jane' };

    try {
      validateSchema(schemaForAjvInstance, ajv)(hookBefore);
      assert.fail(true, false, 'test succeeds unexpectedly');
    } catch (err) {
      console.log(err.errors);
      assert.deepEqual(err.errors, [
        '\'first\' should match format "startWithJo"',
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

  it('fails with array of invalid items when ajv instance is passed', () => {
    hookBeforeArray.data[0] = { first: 'Jane' };
    delete hookBeforeArray.data[2].last;

    try {
      validateSchema(schemaForAjvInstance, ajv)(hookBeforeArray);
      assert.fail(true, false, 'test succeeds unexpectedly');
    } catch (err) {
      console.log(err.errors);
      assert.deepEqual(err.errors, [
        "'in row 1 of 3, first' should match format \"startWithJo\"",
        "in row 1 of 3, should have required property 'last'",
        "'in row 2 of 3, first' should match format \"startWithJo\"",
        "in row 3 of 3, should have required property 'last'"
      ]);
    }
  });
});
