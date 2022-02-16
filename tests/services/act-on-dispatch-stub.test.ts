
if (process.version.substr(0, 2) !== 'v1' && process.version.substr(0, 2) !== 'v8') {
  console.log('\n...act-on-dispatch test ignored. Node version is v8.');
} else {
  require('../../tests-async/act-on-dispatch.test');
}
