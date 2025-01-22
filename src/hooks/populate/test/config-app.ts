import { feathers } from '@feathersjs/feathers';
import { MemoryService } from '@feathersjs/memory';
import getInitDb from './get-init-db';

export default function (dbNames: any) {
  dbNames = typeof dbNames === 'string' ? [dbNames] : dbNames;
  const serviceConfigs: any = {
    users,
    comments,
    posts,
    recommendation,
  };

  return feathers().configure(services);

  function services(app: any) {
    dbNames.forEach((name: any) => {
      // console.log(`configure service ${name}`);
      app.configure(serviceConfigs[name]);
    });
  }

  function users(app: any) {
    app.use('users', new MemoryService(getInitDb('users')));
  }

  function comments(app: any) {
    app.use('comments', new MemoryService(getInitDb('comments')));
  }

  function posts(app: any) {
    app.use('posts', new MemoryService(getInitDb('posts')));
  }

  function recommendation(app: any) {
    app.use('recommendation', new MemoryService(getInitDb('recommendation')));
  }
}
