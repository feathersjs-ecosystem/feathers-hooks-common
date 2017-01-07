
import { promisify } from 'feathers-socket-commons/lib/utils';
import makeDebug from 'debug';

const debug = makeDebug('filters/conditionals');
const ev = 'conditionals'; // todo work needed here before merge with feathers-sockets-common

// https://github.com/feathersjs/feathers-socket-commons/blob/master/src/events.js
// lines 44-69
const dispatchFilters = (promisify, promise, eventFilters, service, data, connection, hook) => {
  if (eventFilters.length) {
    eventFilters.forEach(filterFn => {
      if (filterFn.length === 4) { // function(data, connection, hook, callback)
        promise = promise.then(data => {
          if (data) {
            return promisify(filterFn, service, data, connection, hook);
          }

          return data;
        });
      } else { // function(data, connection, hook)
        promise = promise.then(data => {
          if (data) {
            return filterFn.call(service, data, connection, hook);
          }

          return data;
        });
      }
    });
  }

  promise.catch(e => debug(`Error in filter chain for '${ev}' event`, e));

  return promise;
};

export default function (...eventFilters) {
  return ([data, connection, hook]) => {
    let promise = Promise.resolve(data);

    return dispatchFilters(promisify, promise, eventFilters, this, data, connection, hook);
  };
}
