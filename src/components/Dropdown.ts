import { type Locator, type Page } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Component Object for an Ant Design `Select` ("dropdown").
 *
 * The app uses Ant Design selects for Partner Type, Services, and Subscription
 * tier. They share the same behaviour: the control renders a body-portaled
 * options panel, options are filterable by typing, and the visible option text
 * differs from the option's internal accessible name. Encapsulating that
 * behaviour once keeps the page objects clean and means any future change to
 * how dropdowns work is fixed in exactly one place.
 *
 * Construct it from the `.ant-select` root locator; the page object owns how
 * that root is located (e.g. by the select's stable input id).
 */
export class Dropdown {
  private readonly searchInput: Locator;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.searchInput = root.locator('input');
  }

  /** The currently-open options panel (Ant portals it to the document body). */
  private get panel(): Locator {
    return this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
  }

  private async open(): Promise<void> {
    await this.root.click();
    await this.panel.waitFor({ state: 'visible' });
  }

  /**
   * Selects a single option by its visible text. Typing first narrows long
   * option lists and makes the subsequent click unambiguous.
   */
  async choose(option: string): Promise<void> {
    logger.debug(`Selecting "${option}"`);
    await this.open();
    await this.searchInput.fill(option);
    await this.panel.getByText(option, { exact: true }).click();
    await this.panel.waitFor({ state: 'hidden' });
  }

  /**
   * Selects multiple options (for multi-select dropdowns). The panel stays open
   * between selections, so we reuse it and dismiss it once at the end.
   */
  async chooseMany(options: readonly string[]): Promise<void> {
    logger.debug(`Selecting [${options.join(', ')}]`);
    await this.open();
    for (const option of options) {
      await this.searchInput.fill(option);
      await this.panel.getByText(option, { exact: true }).click();
    }
    await this.page.keyboard.press('Escape');
    await this.panel.waitFor({ state: 'hidden' });
  }
}
