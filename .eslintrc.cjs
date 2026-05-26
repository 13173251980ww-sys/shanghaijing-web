module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['apps/web/**/*.js', 'packages/**/*.js'],
      env: {
        browser: true,
      },
    },
    {
      files: ['apps/api/**/*.js'],
      env: {
        node: true,
      },
    },
  ],
};
