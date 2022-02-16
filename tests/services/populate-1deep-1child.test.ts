
const chai = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'configApp'... Remove this comment to see the full error message
const configApp = require('../helpers/config-app');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getInitDb'... Remove this comment to see the full error message
const getInitDb = require('../helpers/get-init-db');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'populate'.
const { populate } = require('../../lib/services/index');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = chai.assert;
let provider: any;

['array', 'obj'].forEach(type => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe(`services populate - include 1:1 - ${type}`, () => {
    let hookAfter: any;
    let hookAfterArray: any;

    let app: any;
    let recommendation;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      app = configApp(['posts', 'recommendation']);
      recommendation = clone(getInitDb('recommendation').store);

      app.service('posts').hooks({
        before: {
          all: [
            (hook: any) => { provider = hook.params.provider; }
          ]
        }
      });

      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        path: 'recommendations',
        result: recommendation['1']
      };
      hookAfterArray = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        path: 'recommendations',
        result: [recommendation['1'], recommendation['2'], recommendation['3']]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('root is one item', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('saves in nameAs without dot notation', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId', // we have no test for dot notation 'cause no such data
            childField: 'id'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('post');
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('saves in nameAs using dot notation', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post.items',
            parentField: 'postId', // we have no test for dot notation 'cause no such data
            childField: 'id'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('post.items');
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('saves in service as default', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('ignores undefined parentField', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        delete hook.result.postId;

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');

            delete expected.postId;
            delete expected.posts;
            expected._include = [];

            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('uses asArray', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            asArray: true
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
            const expected = recommendationPosts('posts', true);
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Stores null when no joined records and !asArray', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        hook.result.postId = '999';

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');

            expected.postId = '999';
            expected.posts = null;

            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Stores [] when no joined records and asArray', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        hook.result.postId = '999';

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            asArray: true
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');

            expected.postId = '999';
            expected.posts = [];

            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('query overridden by childField', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' }
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Provider in joins defaults to method call', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' }
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
            assert.equal(provider, 'rest'); // Feathers default if not from WebSocket
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Provider in joins can be overridden', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' },
            provider: undefined
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
            assert.equal(provider, undefined);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Provider can be passed down from top level', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          provider: 'global',
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' }
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
            assert.equal(provider, 'global');
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Global provider can be overwritten at schema level', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          provider: 'global',
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' },
            provider: 'socketio'
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
            assert.equal(provider, 'socketio');
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Falsy providers override default provider', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned
        hook.params.provider = 'rest'; // Set up default provider

        const schema = {
          provider: undefined,
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' }
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
            assert.equal(provider, undefined);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('childField overridden by select', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            parentField: 'updatedAt',
            childField: 'id',
            // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'hook' implicitly has an 'any' type.
            select: (hook, parent) => ({
              id: parent.postId
            })
          })
        };

        return populate({ schema })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            const expected = recommendationPosts('posts');
            assert.deepEqual(hook1.result, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('checks permissions', () => {
        const spy: any = [];
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const checkPermissions = (hook: any, service: any, permissions: any, depth: any) => {
          spy.push({ service, permissions, depth });
          return true;
        };

        const schema = {
          permissions: 'for root',
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id',
            permissions: 'for posts'
          })
        };

        return populate({ schema, checkPermissions })(hook)
          .then((hook1: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
            let expected = recommendationPosts('post');
            assert.deepEqual(hook1.result, expected);

            expected = [
              { service: 'recommendations', permissions: 'for root', depth: 0 },
              { service: 'posts', permissions: 'for posts', depth: 1 }
            ];
            assert.deepEqual(spy, expected);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws on invalid permissions', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const checkPermissions = (hook: any, service: any, permissions: any, depth: any) => {
          return depth === 0;
        };

        const schema = {
          permissions: 'for root',
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id',
            permissions: 'for posts'
          })
        };

        return populate({ schema, checkPermissions })(hook)
          .then(() => { throw new Error('was not supposed to succeed'); })
          .catch((err: any) => { assert.notEqual(err, undefined); });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('stores elapsed time', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema, profile: true })(hook)
          .then((hook1: any) => {
            const elapsed = hook1.result._elapsed;
            assert.deepEqual(Object.keys(elapsed), ['post', 'total']);
            assert.isAbove(elapsed.total, 1000);
            assert.isAtLeast(elapsed.total, elapsed.post);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('allow non related field joins if query', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            query: { id: hookAfter.result.postId }
          })
        };

        return populate({ schema, profile: true })(hook)
          .then((hook1: any) => {
            const elapsed = hook1.result._elapsed;
            assert.deepEqual(Object.keys(elapsed), ['post', 'total']);
            assert.isAbove(elapsed.total, 1000);
            assert.isAtLeast(elapsed.total, elapsed.post);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('allow non related field joins if select', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'hook' implicitly has an 'any' type.
            select: (hook, parentItem) => ({
              id: parentItem.postId
            })
          })
        };

        return populate({ schema, profile: true })(hook)
          .then((hook1: any) => {
            const elapsed = hook1.result._elapsed;
            assert.deepEqual(Object.keys(elapsed), ['post', 'total']);
            assert.isAbove(elapsed.total, 1000);
            assert.isAtLeast(elapsed.total, elapsed.post);
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws if no parentField option in related field join', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            childField: 'id'
          })
        };

        return populate({ schema, profile: true })(hook)
          .then(() => {
            assert(false, 'unexpectedly succeeeded');
          })
          .catch((err: any) => {
            assert.isObject(err, 'no error object');
          });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws if no parentField defined in related field join', () => {
        const hook = clone(hookAfter);
        hook.app = app; // app is a func and wouldn't be cloned
        delete hook.result.postId;

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema, profile: true })(hook)
          .then(() => {
            assert(false, 'unexpectedly succeeeded');
          })
          .catch((err: any) => {
            assert.isObject(err, 'no error object');
          });
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('root is item array', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('populates each item', () => {
        const hook = clone(hookAfterArray);
        hook.app = app; // app is a func and wouldn't be cloned

        const schema = {
          include: makeInclude(type, {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id'
          })
        };

        return populate({ schema, profile: true })(hook)
          .then((hook1: any) => {
            assert.equal(hook1.result.length, 3);
          });
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('populate does not change original schema object', () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('check include field', () => {
        const hook = clone(hookAfterArray);
        hook.app = app;

        const includeOptions = () => ({
          service: 'posts',
          nameAs: 'post',
          parentField: 'postId',
          childField: 'id'
        });

        const include = makeInclude(type, includeOptions());
        const expected = makeInclude(type, includeOptions());

        return populate({ schema: { include }, profile: true })(hook)
          .then((hook1: any) => {
            assert.deepEqual(include, expected);
          });
      });
    });
  });
});

// Helpers

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function makeInclude (type: any, obj: any) {
  return type === 'obj' ? obj : [obj];
}

function recommendationPosts (nameAs: any, asArray: any, recommendation: any, posts: any) {
  recommendation = recommendation || clone(getInitDb('recommendation').store['1']);
  posts = posts || clone(getInitDb('posts').store['1']);

  const expected = clone(recommendation);
  expected._include = [nameAs];

  // expected[nameAs] = asArray ? [clone(posts)] : clone(posts);
  setByDot(expected, nameAs, asArray ? [clone(posts)] : clone(posts));

  return expected;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
