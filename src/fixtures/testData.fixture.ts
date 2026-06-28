import { test as base } from '@playwright/test';
import { partnerFactory } from '@data/partner.factory';
import { type Partner } from '@data/partner.types';

export type TestDataFixtures = {
  /** Fresh, unique partner data generated for each test. */
  partner: Partner;
};

/**
 * Provides isolated test data per spec. Each test receives a new factory-
 * generated partner so parallel runs never collide on shared names.
 */
export const testDataTest = base.extend<TestDataFixtures>({
  // eslint-disable-next-line no-empty-pattern -- Playwright requires object destructuring for fixtures
  partner: async ({}, use) => {
    await use(partnerFactory());
  },
});
