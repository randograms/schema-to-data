module.exports = {
  extends: '../.eslintrc.js',
  env: {
    mocha: true,
  },
  globals: {
    sinon: 'readonly',
    expect: 'readonly',
  },
  plugins: [
    'mocha',
  ],
  rules: {
    'func-names': 'off',
    'mocha/no-exclusive-tests': 'error',
    'no-unused-expressions': 'off',
    'prefer-arrow-callback': 'off',
  },
};
