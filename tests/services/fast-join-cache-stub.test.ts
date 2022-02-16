
if (process.version.substr(0, 2) !== 'v1' && process.version.substr(0, 2) !== 'v8') {
  console.log('\n...fast-join-stub test ignored. Node version is prior to v8.');
} else {
  require('../../tests-async/fast-join-cache.test');
}
