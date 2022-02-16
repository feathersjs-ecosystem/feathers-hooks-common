
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooksCommo... Remove this comment to see the full error message
const hooksCommon = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services setSlug', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hook = { type: 'before', method: 'create', params: { provider: 'rest', query: { a: 'a' } } };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('ignore feathers-socketio & feathers-rest clients', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignore feathers-socketio', () => {
      hook.params.provider = 'socketio';
      hooksCommon.setSlug('stockId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignore feathers-rest', () => {
      hook.params.route = {};
      hook.params.route.storeId = ':storeId';
      hooksCommon.setSlug('stockId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles raw HTTP clients', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('copies slug to query', () => {
      hook.params.route = {};
      hook.params.route.storeId = '123';
      hooksCommon.setSlug('storeId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a', storeId: '123' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles field name', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('copies slug to query', () => {
      hook.params.route = {};
      hook.params.route.storeId = '123';
      hooksCommon.setSlug('storeId', 'slugger')(hook);
      assert.equal(hook.params.slugger, '123');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles field name with dot notation', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('copies slug to query', () => {
      hook.params.route = {};
      hook.params.route.storeId = '123';
      hooksCommon.setSlug('storeId', 'query.slugger')(hook);
      assert.deepEqual(hook.params.query, { a: 'a', slugger: '123' });
    });
  });
});
