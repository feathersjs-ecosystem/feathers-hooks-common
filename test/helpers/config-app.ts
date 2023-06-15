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

  function services(this: any) {
    dbNames.forEach((name: any) => {
      // console.log(`configure service ${name}`);
      this.configure(serviceConfigs[name]);
    });
  }

  function users(this: any) {
    this.use('users', new MemoryService(getInitDb('users')));
  }

  function comments(this: any) {
    this.use('comments', new MemoryService(getInitDb('comments')));
  }

  function posts(this: any) {
    this.use('posts', new MemoryService(getInitDb('posts')));
  }

  function recommendation(this: any) {
    this.use('recommendation', new MemoryService(getInitDb('recommendation')));
  }
}
