const prodOnly = process.env.NODE_ENV === 'production' ? 'error' : 'warn'

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': prodOnly,
    'no-debugger': prodOnly,
    'vue/no-unused-components': prodOnly,
    'vue/require-v-for-key': prodOnly,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
