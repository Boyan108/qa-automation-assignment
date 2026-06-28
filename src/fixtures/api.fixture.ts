import { test as base } from '@playwright/test';
import { PartnerApi } from '@api/partner.api';
import { HttpClient, getAccessTokenFromStorageState } from '@api/http-client';
import { partnerFactory } from '@data/partner.factory';
import { type Partner } from '@data/partner.types';
import { env } from '@config/env';
import { logger } from '@utils/logger';

export type ApiFixtures = {
  partnerApi: PartnerApi;
  /** Fresh, unique partner data generated for each test; deleted via API after the test. */
  partner: Partner;
};

/**
 * Provides an authenticated API client for partner teardown and lookups,
 * plus test data with automatic cleanup.
 */
export const apiTest = base.extend<ApiFixtures>({
  partnerApi: async ({ playwright }, use) => {
    const accessToken = getAccessTokenFromStorageState();

    const context = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: accessToken,
        Accept: 'application/json',
      },
    });

    const partnerApi = new PartnerApi(new HttpClient(context), env.apiBaseURL);
    await use(partnerApi);
    await context.dispose();
  },

  partner: async ({ partnerApi }, use) => {
    const data = partnerFactory();
    await use(data);
    try {
      await partnerApi.deleteByName(data.name);
    } catch (error) {
      // DELETE may require MFA on this environment; teardown is best-effort.
      logger.warn(`Partner API teardown failed for "${data.name}"`, error);
    }
  },
});
