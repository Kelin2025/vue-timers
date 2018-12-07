module.exports = {
  extends: 'standard',

  env: {
    node: true,
    browser: true
  },

  rules: {
    'space-before-function-paren': 0
  },

  globals: {
    describe: true,
    it: true,
    before: true,
    beforeEach: true,
    beforeAll: true,
    after: true,
    afterEach: true,
    afterAll: true,
    expect: true,
    jest: true,
  },
}
