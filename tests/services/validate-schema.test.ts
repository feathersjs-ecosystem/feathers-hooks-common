
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateSc... Remove this comment to see the full error message
  validateSchema
} = require('../../lib/services');

const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });
ajv.addFormat('startWithJo', '^Jo');
ajv.addSchema({
  $id: 'syncSchema',
  properties: {
    first: { type: 'string', format: 'startWithJo' },
    last: { type: 'string' }
  },
  required: ['first', 'last']
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services validateSchema', () => {
  let hookBefore: any;
  let hookBeforeArray: any;
  let hookBeforeArrayForAjvInstance: any;
  let schema: any;
  let schemaForAjvInstance: any;
  let asyncSchema: any;
  let ajvAsync: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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
      properties: {
        first: { type: 'string' },
        last: { type: 'string' }
      },
      required: ['first', 'last']
    };
    schemaForAjvInstance = {
      properties: {
        first: { type: 'string', format: 'startWithJo' },
        last: { type: 'string' }
      },
      required: ['first', 'last']
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Sync validation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      schema = {
        properties: {
          first: { type: 'string' },
          last: { type: 'string' }
        },
        required: ['first', 'last']
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with valid single item', () => {
      validateSchema(schema, Ajv)(hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with array of valid items', () => {
      validateSchema(schema, Ajv)(hookBeforeArray);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with valid single item when ajv instance is passed', () => {
      validateSchema(schemaForAjvInstance, ajv)(hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with array of valid items when ajv instance is passed', () => {
      validateSchema(schemaForAjvInstance, ajv)(hookBeforeArrayForAjvInstance);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with valid single item with existing schema in ajv instance', () => {
      validateSchema('syncSchema', ajv)(hookBefore);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with array of valid items with existing schema in ajv instance', () => {
      validateSchema('syncSchema', ajv)(hookBeforeArrayForAjvInstance);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails with invalid single item when ajv instance is passed', () => {
      hookBefore.data = { first: 'Jane' };

      try {
        validateSchema(schemaForAjvInstance, ajv)(hookBefore);
        assert.fail(true, false, 'test succeeds unexpectedly');
      } catch (err) {
        assert.deepEqual(err.errors, [
          '\'first\' should match format "startWithJo"',
          'should have required property \'last\''
        ]);
      }
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails with array of invalid items when ajv instance is passed', () => {
      hookBeforeArray.data[0] = { first: 'Jane' };
      delete hookBeforeArray.data[2].last;

      try {
        validateSchema(schemaForAjvInstance, ajv)(hookBeforeArray);
        assert.fail(true, false, 'test succeeds unexpectedly');
      } catch (err) {
        assert.deepEqual(err.errors, [
          "'in row 1 of 3, first' should match format \"startWithJo\"",
          "in row 1 of 3, should have required property 'last'",
          "'in row 2 of 3, first' should match format \"startWithJo\"",
          "in row 3 of 3, should have required property 'last'"
        ]);
      }
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Async validation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'before'.
    before(() => {
      ajvAsync = new Ajv({ allErrors: true });

      ajvAsync.addKeyword('equalsDoe', {
        async: true,
        schema: false,
        validate: (item: any) => new Promise((resolve, reject) => {
          setTimeout(() => {
            item === 'Doe'
              ? resolve(true)
              : reject(new Ajv.ValidationError([{ message: 'should be Doe' }]));
          }, 50);
        })
      });

      ajvAsync.addFormat('3or4chars', {
        async: true,
        validate: (item: any) => new Promise((resolve, reject) => {
          setTimeout(() => {
            (item.length === 3 || item.length === 4)
              ? resolve(true)
              : resolve(false);
          }, 50);
        })
      });

      ajvAsync.addSchema({
        $id: 'asyncSchema',
        $async: true,
        properties: {
          first: {
            type: 'string',
            format: '3or4chars'
          },
          last: {
            type: 'string',
            equalsDoe: true
          }
        },
        required: ['first', 'last']
      });
    });

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      asyncSchema = {
        $async: true,
        properties: {
          first: {
            type: 'string',
            format: '3or4chars'
          },
          last: {
            type: 'string',
            equalsDoe: true
          }
        },
        required: ['first', 'last']
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with string schema id', (next: any) => {
      validateSchema('asyncSchema', ajvAsync)(hookBefore)
        .then(() => {
          next();
        })
        .catch((err: any) => {
          console.log(err);
          assert.fail(true, false, 'test fails unexpectedly');
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with valid single item', (next: any) => {
      validateSchema(asyncSchema, ajvAsync)(hookBefore)
        .then(() => {
          next();
        })
        .catch((err: any) => {
          console.log(err);
          assert.fail(true, false, 'test fails unexpectedly');
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with array of valid items', (next: any) => {
      validateSchema(asyncSchema, ajvAsync)(hookBeforeArray)
        .then(() => {
          next();
        })
        .catch(() => {
          assert.fail(true, false, 'test fails unexpectedly');
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails with in valid single item', (next: any) => {
      hookBefore.data = { first: '1' };

      validateSchema(asyncSchema, ajvAsync)(hookBefore)
        .then(() => {
          assert.fail(true, false, 'test succeeds unexpectedly');
        })
        .catch((err: any) => {
          assert.deepEqual(err.errors, [
            '\'first\' should match format "3or4chars"',
            'should have required property \'last\''
          ]);
          next();
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails with array of invalid items', (next: any) => {
      hookBeforeArray.data[0].last = 'not Doe';
      delete hookBeforeArray.data[2].last;

      validateSchema(asyncSchema, ajvAsync)(hookBeforeArray)
        .then(() => {
          assert.fail(true, false, 'test succeeds unexpectedly');
        })
        .catch((err: any) => {
          assert.deepEqual(err.errors, [
            'in row 3 of 3, should have required property \'last\'',
            '\'in row 1 of 3, last\' should be Doe'
          ]);
          next();
        });
    });
  });
});
