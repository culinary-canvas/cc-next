module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: ['node_modules/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:regexp/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  globals: {
    context: 'readonly',
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,

    'linebreak-style': ['error', 'unix'],
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'no-empty-function': 'off',
    'padded-blocks': 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'no-return-assign': 0,
    'no-unused-expressions': 0,
    'no-extra-boolean-cast': 0,
    'space-before-function-paren': 0,
    indent: 0,
    'no-new-wrappers': 0,
    'no-useless-constructor': 'off',
    'generator-star-spacing': 'off',
    'comma-dangle': 0,
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['private-constructors'] },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/member-delimiter-style': [
      0,
      {
        multiline: {
          delimiter: 'none',
        },
        singleline: {
          delimiter: 'none',
        },
      },
    ],
  },
}
