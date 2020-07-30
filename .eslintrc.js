module.exports = {
  extends: 'eslint-config-airbnb-base',
  rules: {
    'func-names': 'off',
    'import/extensions': ['error', 'never'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
      },
    ],
    'require-await': 'error',
  },
};
