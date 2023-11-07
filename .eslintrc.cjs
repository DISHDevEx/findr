module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
    parserOptions: {
      project: './tsconfig.json', // Path to your tsconfig.json file
    },
  };
  