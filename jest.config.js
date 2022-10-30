/** @type {import('jest').Config} */
const config = {
  verbose: true,
  globalTeardown: './test-teardown-global.js',
};

module.exports = config;
