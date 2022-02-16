
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'feathers'.
const feathers = require('@feathersjs/feathers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'memory'.
const memory = require('feathers-memory');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getInitDb'... Remove this comment to see the full error message
const getInitDb = require('./get-init-db');

module.exports = function (dbNames: any) {
  dbNames = typeof dbNames === 'string' ? [dbNames] : dbNames;
  const serviceConfigs = {
    users,
    comments,
    posts,
    recommendation
  };

  return feathers()
    .configure(services);

  function services(this: any) {
    dbNames.forEach((name: any) => {
      // console.log(`configure service ${name}`);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      this.configure(serviceConfigs[name]);
    });
  }

  function users(this: any) {
    this.use('users', memory(getInitDb('users')));
  }

  function comments(this: any) {
    this.use('comments', memory(getInitDb('comments')));
  }

  function posts(this: any) {
    this.use('posts', memory(getInitDb('posts')));
  }

  function recommendation(this: any) {
    this.use('recommendation', memory(getInitDb('recommendation')));
  }
};
