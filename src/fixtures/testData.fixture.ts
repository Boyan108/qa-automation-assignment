import { test as base } from '@playwright/test';

/**
 * Reserved for non-API test-data fixtures. Partner data lives in api.fixture
 * because teardown requires the authenticated API client.
 */
export const testDataTest = base.extend({});

export type TestDataFixtures = Record<string, never>;
