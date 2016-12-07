
const chai = require('chai');
const configApp = require('../test/helpers/configApp');
const getInitDb = require('../test/helpers/getInitDb');
const { populate } = require('../src');

const assert = chai.assert;

describe('populate - include 1:1', () => {
  let hookAfter;
  let hookAfterArray;

  let app;
  let recommendation;

  beforeEach(() => {
    app = configApp(['posts', 'recommendation']);
    recommendation = clone(getInitDb('recommendation').store);

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

  describe('root is one item', () => {
    it('saves in nameAs', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId', // we have no test for dot notation 'cause no such data
            childField: 'id'
          }
        ]
      };

      return populate({ schema })(hook)
        .then(hook1 => {
          const expected = recommendationPosts('post');
          assert.deepEqual(hook1.result, expected);
        });
    });

    it('saves in service as default', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            parentField: 'postId',
            childField: 'id'
          }
        ]
      };

      return populate({ schema })(hook)
        .then(hook1 => {
          const expected = recommendationPosts('posts');
          assert.deepEqual(hook1.result, expected);
        });
    });

    it('uses asArray', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            asArray: true
          }
        ]
      };

      return populate({ schema })(hook)
        .then(hook1 => {
          const expected = recommendationPosts('posts', true);
          assert.deepEqual(hook1.result, expected);
        });
    });

    it('query overridden by childField', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            parentField: 'postId',
            childField: 'id',
            query: { id: 'aaaaaa' }
          }
        ]
      };

      return populate({ schema })(hook)
        .then(hook1 => {
          const expected = recommendationPosts('posts');
          assert.deepEqual(hook1.result, expected);
        });
    });

    it('childField overridden by select', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            parentField: 'updatedAt',
            childField: 'id',
            select: (hook, parent) => ({ id: parent.postId })
          }
        ]
      };

      return populate({ schema })(hook)
        .then(hook1 => {
          const expected = recommendationPosts('posts');
          assert.deepEqual(hook1.result, expected);
        });
    });

    it('checks permissions', () => {
      let spy = [];
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const checkPermissions = (hook, service, permissions, depth) => {
        spy.push({ service, permissions, depth });
        return true;
      };

      const schema = {
        permissions: 'for root',
        include: [
          {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id',
            permissions: 'for posts'
          }
        ]
      };

      return populate({ schema, checkPermissions })(hook)
        .then(hook1 => {
          let expected = recommendationPosts('post');
          assert.deepEqual(hook1.result, expected);

          expected = [
            { service: 'recommendations', permissions: 'for root', depth: 0 },
            { service: 'posts', permissions: 'for posts', depth: 1 }
          ];
          assert.deepEqual(spy, expected);
        });
    });

    it('throws on invalid permissions', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const checkPermissions = (hook, service, permissions, depth) => {
        return depth === 0;
      };

      const schema = {
        permissions: 'for root',
        include: [
          {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id',
            permissions: 'for posts'
          }
        ]
      };

      return populate({ schema, checkPermissions })(hook)
        .then(() => { throw new Error('was not supposed to succeed'); })
        .catch(() => {});
    });

    it('stores elapsed time', () => {
      const hook = clone(hookAfter);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id'
          }
        ]
      };

      return populate({ schema, profile: true })(hook)
        .then(hook1 => {
          const elapsed = hook1.result._elapsed;
          assert.deepEqual(Object.keys(elapsed), ['post', 'total']);
          assert.isAbove(elapsed.total, 1000);
          assert.isAtLeast(elapsed.total, elapsed.post);
        });
    });
  });

  describe('root is item array', () => {
    it('populates each item', () => {
      const hook = clone(hookAfterArray);
      hook.app = app; // app is a func and wouldn't be cloned

      const schema = {
        include: [
          {
            service: 'posts',
            nameAs: 'post',
            parentField: 'postId',
            childField: 'id'
          }
        ]
      };

      return populate({ schema, profile: true })(hook)
        .then(hook1 => {
          assert.equal(hook1.result.length, 3);
        });
    });
  });
});

// Helpers

function recommendationPosts (nameAs, asArray, recommendation, posts) {
  recommendation = recommendation || clone(getInitDb('recommendation').store['1']);
  posts = posts || clone(getInitDb('posts').store['1']);

  const expected = clone(recommendation);
  expected._include = [nameAs];

  expected[nameAs] = asArray ? [clone(posts)] : clone(posts);

  return expected;
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
