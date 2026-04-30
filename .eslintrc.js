module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    uni: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    wx: 'readonly',
    Component: 'readonly',
    Page: 'readonly',
    uniCloud: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'prefer-const': 'warn',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    'space-infix-ops': 'error',
    'keyword-spacing': 'error',
    'brace-style': ['error', '1tbs'],
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/html-indent': ['error', 2],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
