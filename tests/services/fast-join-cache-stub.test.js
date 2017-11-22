
if (process.version.substr(0, 2) >= 'v8') {
  require('../../tests-async/fast-join-cache.test');
} else {
  console.log('\n...fast-join-stub test ignored. Node version is prior to v8.');
}
