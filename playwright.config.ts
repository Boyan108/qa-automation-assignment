import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { TIMEOUTS } from './src/config/constants';

/**
 * Playwright configuration.
 *
 * Environment-derived values (base URL, CI detection) come from the typed
 * `env` module so there is a single source of truth. Timeouts come from
 * `constants` so timing behaviour is tunable from one place.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: TIMEOUTS.test,
  expect: { timeout: TIMEOUTS.expect },

  /* Run tests within a file in parallel. */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally committed. */
  forbidOnly: env.isCI,

  /* Retry on CI only; locally a flake should fail loudly so it gets fixed. */
  retries: env.isCI ? 2 : 0,

  /* Limit workers on CI for stable, reproducible runs. */
  workers: env.isCI ? 1 : undefined,

  /* Console output + machine-readable + browsable HTML report. */
  reporter: env.isCI
    ? [['line'], ['junit', { outputFile: 'test-results/junit.xml' }], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL: env.baseURL,
    actionTimeout: TIMEOUTS.action,
    navigationTimeout: TIMEOUTS.navigation,

    /* Forensic artifacts captured only when something goes wrong. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
