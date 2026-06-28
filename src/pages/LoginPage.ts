import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { logger } from '@utils/logger';

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Page Object for the login screen.
 *
 * The app is built with Ant Design and exposes no test ids, names, or labels on
 * the inputs, so we rely on stable semantic attributes (`autocomplete`, input
 * `type`) and the button's accessible name. These are far less brittle than
 * class chains or positional selectors.
 */
export class LoginPage extends BasePage {
  private static readonly PATH = '/login';

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[autocomplete="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: 'Логин' });
  }

  async open(): Promise<void> {
    await this.goto(LoginPage.PATH);
  }

  /**
   * Performs login and waits until the app navigates away from the login route,
   * which is the application's signal that authentication succeeded.
   */
  async login(credentials: Credentials): Promise<void> {
    logger.step(`Logging in as ${credentials.email}`);
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
    await this.page.waitForURL((url) => !url.pathname.startsWith(LoginPage.PATH));
    logger.debug('Login succeeded; navigated away from the login route');
  }
}
