import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'dist/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'playwright/.cache/',
    ],
  },

  js.configs.recommended,

  // Type-aware linting applies only to our TypeScript sources and tests.
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Async correctness is critical in Playwright: an un-awaited promise
      // is the single most common source of flaky, hard-to-debug tests.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // Playwright-specific rules apply only to test files.
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },

  // Disables stylistic rules that would conflict with Prettier.
  prettier,
);
