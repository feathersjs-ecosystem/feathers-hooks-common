
if (process.version.substr(0, 2) >= 'v8') {
  require('../../tests-async/act-on-dispatch.test');
} else {
  console.log('\n...act-on-dispatch test ignored. Node version is prior to v8.');
}
