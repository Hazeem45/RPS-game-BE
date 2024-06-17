import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  {
    files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' },
  },
  {
    languageOptions: { globals: globals.node },
  },
  {
    ignores: ['db/'],
  },
  {
    rules: {
      'quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      'semi': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'camelcase': 'error',
      'keyword-spacing': [
        'error', { 'before': true },
      ],
      'indent': ['error', 2],
      'no-multi-spaces': 'error',
    },
  },
  pluginJs.configs.recommended,
];