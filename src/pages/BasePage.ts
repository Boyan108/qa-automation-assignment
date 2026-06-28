import { type Page } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Thin base class shared by all Page Objects.
 *
 * Intentionally minimal: it holds the `page` handle and a navigation helper.
 * Resisting the urge to pile shared utilities here keeps page objects focused
 * and avoids the "god base class" anti-pattern.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /**
   * Navigates to a path relative to the configured `baseURL`.
   */
  protected async goto(path = '/'): Promise<void> {
    logger.debug(`Navigating to "${path}"`);
    await this.page.goto(path);
  }
}
