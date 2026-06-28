import { mergeTests, expect } from '@playwright/test';
import { pagesTest } from '@fixtures/pages.fixture';
import { testDataTest } from '@fixtures/testData.fixture';
import { apiTest } from '@fixtures/api.fixture';

/**
 * Composition root for the test suite.
 *
 * Import `test` and `expect` from here in partner (and other feature) specs
 * to receive injected page objects, fresh test data, and API helpers. Auth
 * specs that exercise login directly continue to import from `@playwright/test`.
 */
export const test = mergeTests(pagesTest, apiTest, testDataTest);

export { expect };

export type { PageFixtures } from '@fixtures/pages.fixture';
export type { TestDataFixtures } from '@fixtures/testData.fixture';
export type { ApiFixtures } from '@fixtures/api.fixture';
