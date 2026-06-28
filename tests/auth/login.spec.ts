import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { env } from '@config/env';

// This spec exercises the login flow itself, so it must start from a clean,
// unauthenticated state rather than the shared persisted session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(env.credentials);

    // The app's success signal is leaving the login route...
    await expect(page).not.toHaveURL(/\/login/);
    // ...and the authenticated user's identity is shown in the app shell.
    await expect(page.getByText(env.credentials.email).first()).toBeVisible();
  });
});
