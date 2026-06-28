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
  partner: async (_fixtures, use) => {
    await use(partnerFactory());
  },
});
