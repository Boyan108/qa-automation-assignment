import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { env } from '@config/env';
import { STORAGE_STATE_PATH } from '@config/constants';

/**
 * Authentication setup.
 *
 * Runs once before the main test suite (wired as a Playwright "setup" project
 * dependency). It performs a real UI login and persists the authenticated
 * session to disk, so every subsequent test starts already logged in instead
 * of repeating the login flow. This is both faster and more reliable: login is
 * exercised explicitly by its own test, not implicitly by every other spec.
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(env.credentials);
  await expect(page.getByText(env.credentials.email).first()).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
