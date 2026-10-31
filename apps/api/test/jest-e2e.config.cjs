/** @type {import('jest').Config} */
module.exports = {
  ...require('../jest.config.cjs'),
  rootDir: '..',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
}
