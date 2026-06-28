import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { PartnerFormPage } from '@pages/PartnerFormPage';
import { PartnersListPage } from '@pages/PartnersListPage';

export type PageFixtures = {
  loginPage: LoginPage;
  partnersPage: PartnersListPage;
  partnerForm: PartnerFormPage;
};

/**
 * Injects pre-constructed page objects bound to the current browser page.
 * Specs declare what they need; fixtures handle instantiation.
 */
export const pagesTest = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  partnersPage: async ({ page }, use) => {
    await use(new PartnersListPage(page));
  },

  partnerForm: async ({ page }, use) => {
    await use(new PartnerFormPage(page));
  },
});
